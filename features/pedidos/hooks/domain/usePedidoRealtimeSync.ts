import { useEffect } from 'react';
import { subscribePedidosRealtime, type RealtimeStatus } from '@/lib/services/pedidosRealtime';

interface UsePedidoRealtimeSyncOptions {
  enabled: boolean;
  vendorPin: string;
  refreshActiveOrder: (pin: string) => Promise<unknown>;
  onStatusChange: (status: RealtimeStatus) => void;
}

export function usePedidoRealtimeSync({
  enabled,
  vendorPin,
  refreshActiveOrder,
  onStatusChange,
}: UsePedidoRealtimeSyncOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const unsubscribe = subscribePedidosRealtime(
      () => {
        refreshActiveOrder(vendorPin).catch((realtimeError) => {
          console.error('Error refreshing realtime order:', realtimeError);
        });
      },
      onStatusChange,
      { debounceMs: 120 },
    );

    return () => {
      unsubscribe();
    };
  }, [enabled, onStatusChange, refreshActiveOrder, vendorPin]);
}

