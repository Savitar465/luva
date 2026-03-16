import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type RealtimeStatus = 'CONNECTED' | 'DISCONNECTED';

interface SubscribePedidosRealtimeOptions {
  debounceMs?: number;
  vendorPin?: string;
}

export function subscribePedidosRealtime(
  onMutation: () => void,
  onStatusChange?: (status: RealtimeStatus) => void,
  { debounceMs = 0, vendorPin }: SubscribePedidosRealtimeOptions = {},
): () => void {
  const channelName = `pedidos-live-${Math.random().toString(36).slice(2)}`;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const normalizedVendorPin = vendorPin?.trim().toUpperCase();

  const notifyMutation = () => {
    if (debounceMs <= 0) {
      onMutation();
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      onMutation();
    }, debounceMs);
  };

  const pedidosFilter = normalizedVendorPin ? `vendedor_pin=eq.${normalizedVendorPin}` : undefined;

  const channel: RealtimeChannel = supabase
    .channel(channelName)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'pedidos',
      filter: pedidosFilter,
    }, () => {
      notifyMutation();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'detalle_pedidos' }, () => {
      notifyMutation();
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        onStatusChange?.('CONNECTED');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        onStatusChange?.('DISCONNECTED');
      }
    });

  return () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    supabase.removeChannel(channel);
    onStatusChange?.('DISCONNECTED');
  };
}

