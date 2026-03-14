import { useCallback, useRef, useState } from 'react';
import { normalizeCount } from '@/features/pedidos/domain/pedidoPresentation';
import type { PresentationViewModel } from '@/features/pedidos/types';
import { addOrIncrementItemsBatch } from '@/lib/services/pedidos';

interface BatchFailureContext {
  pedidoId: number;
  vendorPin: string;
  error: unknown;
}

interface UsePedidoAddQueueOptions {
  vendorPin: string;
  getPedidoId: () => number | null;
  onBatchSuccess?: () => void;
  onBatchFailed?: (context: BatchFailureContext) => Promise<void> | void;
}

export function usePedidoAddQueue({
  vendorPin,
  getPedidoId,
  onBatchSuccess,
  onBatchFailed,
}: UsePedidoAddQueueOptions) {
  const [pendingAdds, setPendingAdds] = useState(0);
  const mutationQueueRef = useRef<Promise<void>>(Promise.resolve());
  const isFlushingAddsRef = useRef(false);
  const bufferedAddsRef = useRef<Map<number, { presentation: PresentationViewModel; count: number }>>(new Map());
  const pendingLocalAddsRef = useRef<Map<number, number>>(new Map());
  const presentationsByIdRef = useRef<Map<number, PresentationViewModel>>(new Map());

  const registerPresentationModels = useCallback((presentations: PresentationViewModel[]) => {
    presentationsByIdRef.current = new Map(
      presentations.map((presentation) => [presentation.id, presentation]),
    );
  }, []);

  const resetQueueState = useCallback(() => {
    setPendingAdds(0);
    bufferedAddsRef.current = new Map();
    pendingLocalAddsRef.current = new Map();
  }, []);

  const rememberPendingLocalAdd = useCallback((presentation: PresentationViewModel, count = 1) => {
    const normalized = normalizeCount(count);
    const currentPending = pendingLocalAddsRef.current.get(presentation.id) ?? 0;

    presentationsByIdRef.current.set(presentation.id, presentation);
    pendingLocalAddsRef.current.set(presentation.id, currentPending + normalized);
    setPendingAdds((currentCount) => currentCount + normalized);
  }, []);

  const releasePendingLocalAdd = useCallback((presentationId: number, count = 1) => {
    const normalized = normalizeCount(count);
    const currentPending = pendingLocalAddsRef.current.get(presentationId) ?? 0;
    const nextPending = Math.max(0, currentPending - normalized);

    if (nextPending === 0) {
      pendingLocalAddsRef.current.delete(presentationId);
    } else {
      pendingLocalAddsRef.current.set(presentationId, nextPending);
    }

    setPendingAdds((currentCount) => Math.max(0, currentCount - normalized));
  }, []);

  const flushBufferedAdds = useCallback(() => {
    if (isFlushingAddsRef.current) {
      return mutationQueueRef.current;
    }
    isFlushingAddsRef.current = true;

    mutationQueueRef.current = mutationQueueRef.current
      .then(async () => {
        // Drain all buffered taps in strict order with a single request in flight.
        while (true) {
          const pedidoId = getPedidoId();
          const batch = Array.from(bufferedAddsRef.current.values());

          if (batch.length === 0 || !pedidoId) {
            return;
          }

          bufferedAddsRef.current = new Map();

          try {
            await addOrIncrementItemsBatch(
              pedidoId,
              batch.map((entry) => ({ producto: entry.presentation.dbProduct, count: entry.count })),
              true,
            );

            batch.forEach((entry) => {
              releasePendingLocalAdd(entry.presentation.id, entry.count);
            });

            onBatchSuccess?.();
          } catch (error) {
            batch.forEach((entry) => {
              releasePendingLocalAdd(entry.presentation.id, entry.count);
            });

            await onBatchFailed?.({ pedidoId, vendorPin, error });
          }
        }
      })
      .finally(() => {
        isFlushingAddsRef.current = false;
      });

    return mutationQueueRef.current;
  }, [getPedidoId, onBatchFailed, onBatchSuccess, releasePendingLocalAdd, vendorPin]);

  const queueAdd = useCallback(
    (presentation: PresentationViewModel, count = 1) => {
      const normalized = normalizeCount(count);
      rememberPendingLocalAdd(presentation, normalized);

      const bufferedEntry = bufferedAddsRef.current.get(presentation.id);
      bufferedAddsRef.current.set(presentation.id, {
        presentation,
        count: (bufferedEntry?.count ?? 0) + normalized,
      });

      void flushBufferedAdds();
    },
    [flushBufferedAdds, rememberPendingLocalAdd],
  );

  const flushPendingMutations = useCallback(async () => {
    await flushBufferedAdds();
    await mutationQueueRef.current;
  }, [flushBufferedAdds]);

  return {
    pendingAdds,
    pendingLocalAddsRef,
    presentationsByIdRef,
    registerPresentationModels,
    resetQueueState,
    queueAdd,
    flushPendingMutations,
  };
}


