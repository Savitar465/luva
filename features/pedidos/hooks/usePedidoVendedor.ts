'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PresentationViewModel } from '@/features/pedidos/types';
import {
  incrementPedidoItem,
  mergePendingAddsIntoPedido,
} from '@/features/pedidos/utils/pedidoOptimistic';
import { resolvePedidoIcon } from '@/features/shared/utils/iconResolver';
import {
  addOrIncrementItem,
  ensurePedidoActivo,
  finalizePedido,
  getPedidoActivoView,
  syncPedidoTotal,
} from '@/lib/services/pedidos';
import { getPresentaciones } from '@/lib/services/productos';
import { subscribePedidosRealtime } from '@/lib/services/pedidosRealtime';
import type { PedidoActivoView } from '@/lib/types/pedidos';

interface UsePedidoVendedorOptions {
  vendorPin: string;
  enabled?: boolean;
}

const ADD_BATCH_WINDOW_MS = 90;

function toPresentationViewModel(producto: Awaited<ReturnType<typeof getPresentaciones>>[number]): PresentationViewModel {
  return {
    id: producto.id,
    name: producto.nombre,
    basePrice: Number(producto.precio_unitario),
    icon: resolvePedidoIcon(producto.nombre),
    dbProduct: producto,
  };
}

function normalizeCount(count: number) {
  return Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
}

export function usePedidoVendedor({ vendorPin, enabled = true }: UsePedidoVendedorOptions) {
  const [presentations, setPresentations] = useState<PresentationViewModel[]>([]);
  const [activeOrder, setActiveOrder] = useState<PedidoActivoView | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [pendingAdds, setPendingAdds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');
  const [lastAddedPresentationId, setLastAddedPresentationId] = useState<number | null>(null);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);
  const clearFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushAddsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mutationQueueRef = useRef<Promise<void>>(Promise.resolve());
  const bufferedAddsRef = useRef<Map<number, { presentation: PresentationViewModel; count: number }>>(new Map());
  const pendingLocalAddsRef = useRef<Map<number, number>>(new Map());
  const presentationsByIdRef = useRef<Map<number, PresentationViewModel>>(new Map());
  const activeOrderRef = useRef<PedidoActivoView | null>(null);

  useEffect(() => {
    activeOrderRef.current = activeOrder;
  }, [activeOrder]);

  const refreshActiveOrder = useCallback(async (pin: string) => {
    const snapshot = await getPedidoActivoView(pin);
    const mergedSnapshot = mergePendingAddsIntoPedido(
      snapshot,
      pendingLocalAddsRef.current,
      presentationsByIdRef.current,
    );

    setActiveOrder(mergedSnapshot);

    return mergedSnapshot;
  }, []);

  const showAddFeedback = useCallback((presentation: PresentationViewModel) => {
    setLastAddedPresentationId(presentation.id);
    setAddFeedback(`${presentation.name} +1`);

    if (clearFeedbackTimerRef.current) {
      clearTimeout(clearFeedbackTimerRef.current);
    }

    clearFeedbackTimerRef.current = setTimeout(() => {
      setLastAddedPresentationId(null);
      setAddFeedback(null);
    }, 650);
  }, []);

  useEffect(() => {
    return () => {
      if (clearFeedbackTimerRef.current) {
        clearTimeout(clearFeedbackTimerRef.current);
      }

      if (flushAddsTimerRef.current) {
        clearTimeout(flushAddsTimerRef.current);
      }
    };
  }, []);

  const rememberPendingLocalAdd = useCallback((presentation: PresentationViewModel, count = 1) => {
    const normalizedCount = normalizeCount(count);
    const currentPending = pendingLocalAddsRef.current.get(presentation.id) ?? 0;

    presentationsByIdRef.current.set(presentation.id, presentation);
    pendingLocalAddsRef.current.set(presentation.id, currentPending + normalizedCount);
    setPendingAdds((currentCount) => currentCount + normalizedCount);
  }, []);

  const releasePendingLocalAdd = useCallback((presentationId: number, count = 1) => {
    const normalizedCount = normalizeCount(count);
    const currentPending = pendingLocalAddsRef.current.get(presentationId) ?? 0;
    const nextPending = Math.max(0, currentPending - normalizedCount);

    if (nextPending === 0) {
      pendingLocalAddsRef.current.delete(presentationId);
    } else {
      pendingLocalAddsRef.current.set(presentationId, nextPending);
    }

    setPendingAdds((currentCount) => Math.max(0, currentCount - normalizedCount));
  }, []);

  const flushBufferedAdds = useCallback(() => {
    if (flushAddsTimerRef.current) {
      clearTimeout(flushAddsTimerRef.current);
      flushAddsTimerRef.current = null;
    }

    const batch = Array.from(bufferedAddsRef.current.values());
    const pedidoId = activeOrderRef.current?.id;

    if (batch.length === 0 || !pedidoId) {
      return mutationQueueRef.current;
    }

    bufferedAddsRef.current = new Map();
    const currentVendorPin = vendorPin;

    mutationQueueRef.current = mutationQueueRef.current
      .then(async () => {
        await Promise.all(
          batch.map((entry) => addOrIncrementItem(pedidoId, entry.presentation.dbProduct, entry.count, false)),
        );

        await syncPedidoTotal(pedidoId);

        batch.forEach((entry) => {
          releasePendingLocalAdd(entry.presentation.id, entry.count);
        });

        setError(null);
      })
      .catch(async (queueError) => {
        console.error('Error adding item batch:', queueError);

        batch.forEach((entry) => {
          releasePendingLocalAdd(entry.presentation.id, entry.count);
        });

        setError('No se pudo agregar el producto.');

        try {
          await syncPedidoTotal(pedidoId);
          await refreshActiveOrder(currentVendorPin);
        } catch (refreshError) {
          console.error('Error resyncing order after add failure:', refreshError);
        }
      });

    return mutationQueueRef.current;
  }, [refreshActiveOrder, releasePendingLocalAdd, vendorPin]);

  const scheduleBufferedAddsFlush = useCallback(() => {
    if (flushAddsTimerRef.current) {
      clearTimeout(flushAddsTimerRef.current);
    }

    flushAddsTimerRef.current = setTimeout(() => {
      void flushBufferedAdds();
    }, ADD_BATCH_WINDOW_MS);
  }, [flushBufferedAdds]);

  const flushPendingMutations = useCallback(async () => {
    await flushBufferedAdds();
    await mutationQueueRef.current;
  }, [flushBufferedAdds]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isCancelled = false;

    async function initialize() {
      try {
        setLoading(true);
        setPendingAdds(0);
        bufferedAddsRef.current = new Map();
        pendingLocalAddsRef.current = new Map();

        if (flushAddsTimerRef.current) {
          clearTimeout(flushAddsTimerRef.current);
          flushAddsTimerRef.current = null;
        }

        const [productos] = await Promise.all([
          getPresentaciones(),
          ensurePedidoActivo(vendorPin),
        ]);

        if (isCancelled) {
          return;
        }

        const presentationViewModels = productos.map(toPresentationViewModel);
        presentationsByIdRef.current = new Map(
          presentationViewModels.map((presentation) => [presentation.id, presentation]),
        );

        setPresentations(presentationViewModels);
        await refreshActiveOrder(vendorPin);

        if (!isCancelled) {
          setError(null);
        }
      } catch (initializationError) {
        console.error('Error initializing pedidos page:', initializationError);
        if (!isCancelled) {
          setError('No se pudo cargar la pantalla de pedidos. Verifica tu conexion con Supabase.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    const unsubscribe = subscribePedidosRealtime(
      () => {
        refreshActiveOrder(vendorPin).catch((realtimeError) => {
          console.error('Error refreshing realtime order:', realtimeError);
        });
      },
      setRealtimeStatus,
      { debounceMs: 120 },
    );

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [enabled, refreshActiveOrder, vendorPin]);

  const qtyByPresentationId = useMemo(() => {
    const map = new Map<number, number>();
    activeOrder?.items.forEach((item) => {
      map.set(item.productoId, item.cantidad);
    });
    return map;
  }, [activeOrder]);

  const handleAdd = useCallback(
    (presentation: PresentationViewModel) => {
      if (!activeOrderRef.current) {
        return;
      }

      showAddFeedback(presentation);
      setError(null);
      rememberPendingLocalAdd(presentation);
      setActiveOrder((currentOrder) =>
        currentOrder ? incrementPedidoItem(currentOrder, presentation) : currentOrder,
      );

      const bufferedEntry = bufferedAddsRef.current.get(presentation.id);
      bufferedAddsRef.current.set(presentation.id, {
        presentation,
        count: (bufferedEntry?.count ?? 0) + 1,
      });

      scheduleBufferedAddsFlush();
    },
    [rememberPendingLocalAdd, scheduleBufferedAddsFlush, showAddFeedback],
  );

  const handleFinalize = useCallback(async () => {
    if (!activeOrder || activeOrder.items.length === 0) {
      return;
    }

    try {
      setIsFinalizing(true);
      await flushPendingMutations();
      await finalizePedido(activeOrder.id, vendorPin);
      await ensurePedidoActivo(vendorPin);
      await refreshActiveOrder(vendorPin);
      setError(null);
    } catch (finalizeError) {
      console.error('Error finalizing order:', finalizeError);
      setError('No se pudo finalizar el pedido.');
    } finally {
      setIsFinalizing(false);
    }
  }, [activeOrder, flushPendingMutations, refreshActiveOrder, vendorPin]);

  return {
    presentations,
    activeOrder,
    loading,
    isFinalizing,
    pendingAdds,
    error,
    realtimeStatus,
    lastAddedPresentationId,
    addFeedback,
    qtyByPresentationId,
    handleAdd,
    handleFinalize,
    canAddItems: !loading && !isFinalizing && Boolean(activeOrder),
    canFinalize: !isFinalizing && pendingAdds === 0 && Boolean(activeOrder?.items.length),
  };
}

