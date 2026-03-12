'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  addOrIncrementItem,
  ensurePedidoActivo,
  finalizePedido,
  getPedidoActivoView,
} from '@/lib/services/pedidos';
import { subscribePedidosRealtime } from '@/lib/services/pedidosRealtime';
import type { PedidoActivoView } from '@/lib/types/pedidos';
import { getPresentaciones } from '@/lib/services/productos';
import type { PresentationViewModel } from '@/features/pedidos/types';
import {resolvePedidoIcon} from "@/features/shared/utils/iconResolver";


interface UsePedidoVendedorOptions {
  vendorPin: string;
  enabled?: boolean;
}

function toPresentationViewModel(producto: Awaited<ReturnType<typeof getPresentaciones>>[number]): PresentationViewModel {
  return {
    id: producto.id,
    name: producto.nombre,
    basePrice: Number(producto.precio_unitario),
    icon: resolvePedidoIcon(producto.nombre),
    dbProduct: producto,
  };
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
  const mutationQueueRef = useRef<Promise<void>>(Promise.resolve());

  const refreshActiveOrder = useCallback(async (pin: string) => {
    const snapshot = await getPedidoActivoView(pin);
    setActiveOrder(snapshot);
    return snapshot;
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

        const [productos] = await Promise.all([
          getPresentaciones(),
          ensurePedidoActivo(vendorPin),
        ]);

        if (isCancelled) {
          return;
        }

        setPresentations(productos.map(toPresentationViewModel));
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
      if (!activeOrder) {
        return;
      }

      const pedidoId = activeOrder.id;
      const currentVendorPin = vendorPin;

      showAddFeedback(presentation);
      setError(null);
      setPendingAdds((count) => count + 1);

      mutationQueueRef.current = mutationQueueRef.current
        .then(async () => {
          await addOrIncrementItem(pedidoId, presentation.dbProduct);
          await refreshActiveOrder(currentVendorPin);
        })
        .catch(async (queueError) => {
          console.error('Error adding item:', queueError);
          setError('No se pudo agregar el producto.');

          try {
            await refreshActiveOrder(currentVendorPin);
          } catch (refreshError) {
            console.error('Error resyncing order after add failure:', refreshError);
          }
        })
        .finally(() => {
          setPendingAdds((count) => Math.max(0, count - 1));
        });
    },
    [activeOrder, refreshActiveOrder, showAddFeedback, vendorPin],
  );

  const handleFinalize = useCallback(async () => {
    if (!activeOrder || activeOrder.items.length === 0) {
      return;
    }

    try {
      setIsFinalizing(true);
      await mutationQueueRef.current;
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
  }, [activeOrder, refreshActiveOrder, vendorPin]);

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

