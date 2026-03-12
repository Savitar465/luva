interface RealtimeStatusBarProps {
  realtimeStatus: 'CONNECTED' | 'DISCONNECTED';
  activeOrderId?: number | null;
  pendingAdds: number;
}

export function RealtimeStatusBar({ realtimeStatus, activeOrderId, pendingAdds }: RealtimeStatusBarProps) {
  return (
    <section className="flex flex-col gap-2 border-b border-gray-100 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-gray-600">
        Estado realtime:{' '}
        <strong className={realtimeStatus === 'CONNECTED' ? 'text-emerald-600' : 'text-red-500'}>
          {realtimeStatus === 'CONNECTED' ? 'Conectado' : 'Desconectado'}
        </strong>
      </span>

      <div className="flex flex-wrap items-center gap-3 text-gray-500">
        <span>Pedido activo #{activeOrderId ?? '-'}</span>
        {pendingAdds > 0 ? <span>Sincronizando {pendingAdds} accion(es)...</span> : null}
      </div>
    </section>
  );
}

