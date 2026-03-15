interface RealtimeStatusBarProps {
  activeOrderId?: number | null;
  pendingAdds: number;
}

export function RealtimeStatusBar({ activeOrderId, pendingAdds }: RealtimeStatusBarProps) {
  return (
    <section className="flex flex-col gap-2 border-b border-gray-100 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-gray-500">
        <span>Pedido activo #{activeOrderId ?? '-'}</span>
        {pendingAdds > 0 ? <span className="text-blue-800 font-bold">Sincronizando {pendingAdds} accion(es)...</span> : null}
      </div>
    </section>
  );
}

