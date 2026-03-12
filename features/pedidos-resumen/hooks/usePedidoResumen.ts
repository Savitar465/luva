'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getLatestPedidoActivoView } from '@/lib/services/pedidos';
import { subscribePedidosRealtime } from '@/lib/services/pedidosRealtime';
import type { PedidoActivoView } from '@/lib/types/pedidos';

interface UsePedidoResumenOptions {
  vendorPin?: string | null;
}

export function usePedidoResumen({ vendorPin }: UsePedidoResumenOptions = {}) {
  const [pedido, setPedido] = useState<PedidoActivoView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');

  const normalizedVendorPin = vendorPin?.trim().toUpperCase() || undefined;

  const loadPedido = useCallback(async () => {
    const snapshot = await getLatestPedidoActivoView(normalizedVendorPin);
    setPedido(snapshot);
  }, [normalizedVendorPin]);

  useEffect(() => {
    let isCancelled = false;

    async function initialize() {
      try {
        setLoading(true);
        await loadPedido();
        if (!isCancelled) {
          setError(null);
        }
      } catch (loadError) {
        console.error('Error loading customer display:', loadError);
        if (!isCancelled) {
          setError('No se pudo cargar el pedido en pantalla.');
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
        loadPedido().catch((realtimeError) => {
          console.error('Error refreshing realtime customer display:', realtimeError);
        });
      },
      setRealtimeStatus,
    );

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [loadPedido]);

  const total = useMemo(() => Number(pedido?.total ?? 0), [pedido]);

  return {
    pedido,
    loading,
    error,
    realtimeStatus,
    total,
    vendorPin: normalizedVendorPin,
  };
}

