'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toPresentationViewModel } from '@/features/pedidos/domain/pedidoPresentation';
import { usePedidoAddQueue } from '@/features/pedidos/hooks/domain/usePedidoAddQueue';
import { usePedidoRealtimeSync } from '@/features/pedidos/hooks/domain/usePedidoRealtimeSync';
import type { PresentationViewModel } from '@/features/pedidos/types';
import {
  incrementPedidoItem,
  mergePendingAddsIntoPedido,
  removePedidoItem,
} from '@/features/pedidos/utils/pedidoOptimistic';
import {
  cancelPedido,
  ensurePedidoActivo,
  finalizePedido,
  getPedidoActivoView,
  removeItem,
  syncPedidoTotal,
} from '@/lib/services/pedidos';
import { getPresentaciones } from '@/lib/services/productos';
import type { PedidoActivoView } from '@/lib/types/pedidos';

interface UsePedidoVendedorOptions {
  vendorPin: string;
  enabled?: boolean;
}

export function usePedidoVendedor({ vendorPin, enabled = true }: UsePedidoVendedorOptions) {
  const [presentations, setPresentations] = useState<PresentationViewModel[]>([]);
  const [activeOrder, setActiveOrder] = useState<PedidoActivoView | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');
  const [lastAddedPresentationId, setLastAddedPresentationId] = useState<number | null>(null);
  const clearFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeOrderRef = useRef<PedidoActivoView | null>(null);
  const refreshActiveOrderRef = useRef<(pin: string) => Promise<PedidoActivoView | null>>(async () => null);

  const getPedidoId = useCallback(() => activeOrderRef.current?.id ?? null, []);

  const handleBatchFailure = useCallback(
    async ({ pedidoId, error: queueError }: { pedidoId: number; error: unknown }) => {
      console.error('Error adding item batch:', queueError);
      setError('No se pudo agregar el producto.');

      try {
        await syncPedidoTotal(pedidoId);
        await refreshActiveOrderRef.current(vendorPin);
      } catch (refreshError) {
        console.error('Error resyncing order after add failure:', refreshError);
      }
    },
    [vendorPin],
  );

  const {
    pendingAdds,
    pendingLocalAddsRef,
    presentationsByIdRef,
    registerPresentationModels,
    resetQueueState,
    queueAdd,
    flushPendingMutations,
  } = usePedidoAddQueue({
    vendorPin,
    getPedidoId,
    onBatchSuccess: () => {
      setError(null);
    },
    onBatchFailed: handleBatchFailure,
  });

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
  }, [pendingLocalAddsRef, presentationsByIdRef]);

  useEffect(() => {
    refreshActiveOrderRef.current = refreshActiveOrder;
  }, [refreshActiveOrder]);

  useEffect(() => {
    return () => {
      if (clearFeedbackTimerRef.current) {
        clearTimeout(clearFeedbackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isCancelled = false;

    async function initialize() {
      try {
        setLoading(true);
        resetQueueState();

        const [productos] = await Promise.all([
          getPresentaciones(),
          ensurePedidoActivo(vendorPin),
        ]);

        if (isCancelled) {
          return;
        }

        const presentationViewModels = productos.map(toPresentationViewModel);
        registerPresentationModels(presentationViewModels);

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

    return () => {
      isCancelled = true;
    };
  }, [enabled, refreshActiveOrder, registerPresentationModels, resetQueueState, vendorPin]);

  usePedidoRealtimeSync({
    enabled,
    vendorPin,
    refreshActiveOrder,
    onStatusChange: setRealtimeStatus,
  });

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
      setError(null);
      queueAdd(presentation);
      setActiveOrder((currentOrder) =>
        currentOrder ? incrementPedidoItem(currentOrder, presentation) : currentOrder,
      );
    },
    [queueAdd],
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

  const handleRemoveItem = useCallback(async (productoId: number) => {
    const currentOrder = activeOrderRef.current;

    if (!currentOrder) {
      return;
    }

    const previousOrder = currentOrder;

    setError(null);
    setActiveOrder((pedido) => (pedido ? removePedidoItem(pedido, productoId) : pedido));

    try {
      await flushPendingMutations();
      await removeItem(previousOrder.id, productoId);
      await refreshActiveOrder(vendorPin);
    } catch (removeError) {
      console.error('Error removing item from order:', removeError);
      setActiveOrder(previousOrder);
      setError('No se pudo eliminar el producto del pedido.');
    }
  }, [flushPendingMutations, refreshActiveOrder, vendorPin]);

  const handleCancelOrder = useCallback(async () => {
    const currentOrder = activeOrderRef.current;

    if (!currentOrder || currentOrder.items.length === 0) {
      return;
    }

    const isConfirmed = window.confirm('Se cancelara el pedido actual. Esta accion no se puede deshacer.');

    if (!isConfirmed) {
      return;
    }

    try {
      setIsCancelling(true);
      await flushPendingMutations();
      await cancelPedido(currentOrder.id, vendorPin);
      await ensurePedidoActivo(vendorPin);
      await refreshActiveOrder(vendorPin);
      setError(null);
    } catch (cancelError) {
      console.error('Error canceling order:', cancelError);
      setError('No se pudo cancelar el pedido.');
    } finally {
      setIsCancelling(false);
    }
  }, [flushPendingMutations, refreshActiveOrder, vendorPin]);

  return {
    presentations,
    activeOrder,
    loading,
    isFinalizing,
    isCancelling,
    pendingAdds,
    error,
    realtimeStatus,
    lastAddedPresentationId,
    qtyByPresentationId,
    handleAdd,
    handleRemoveItem,
    handleCancelOrder,
    handleFinalize,
    canAddItems: !loading && !isFinalizing && !isCancelling && Boolean(activeOrder),
    canFinalize: !isFinalizing && !isCancelling && pendingAdds === 0 && Boolean(activeOrder?.items.length),
    canCancel: !isFinalizing && !isCancelling && pendingAdds === 0 && Boolean(activeOrder?.items.length),
  };
}

