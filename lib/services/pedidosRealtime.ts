import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type RealtimeStatus = 'CONNECTED' | 'DISCONNECTED';

export function subscribePedidosRealtime(
  onMutation: () => void,
  onStatusChange?: (status: RealtimeStatus) => void,
): () => void {
  const channelName = `pedidos-live-${Math.random().toString(36).slice(2)}`;

  const channel: RealtimeChannel = supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => {
      onMutation();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'detalle_pedidos' }, () => {
      onMutation();
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        onStatusChange?.('CONNECTED');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        onStatusChange?.('DISCONNECTED');
      }
    });

  return () => {
    supabase.removeChannel(channel);
    onStatusChange?.('DISCONNECTED');
  };
}

