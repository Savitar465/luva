interface PedidoFooterProps {
  total: number;
  disabled: boolean;
  pendingAdds: number;
  isFinalizing: boolean;
  onFinalize: () => void;
}

export function PedidoFooter({
  total,
  disabled,
  pendingAdds,
  isFinalizing,
  onFinalize,
}: PedidoFooterProps) {
  return (
    <footer className="mt-auto flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-[#141414]">Total del pedido</p>
        <p className="text-xs text-gray-500">
          {pendingAdds > 0 ? 'Esperando a que se sincronicen los toques pendientes' : 'Se guarda y sincroniza en cada accion'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-[#141414]">${total.toFixed(2)}</span>
        <button
          onClick={onFinalize}
          disabled={disabled}
          className="rounded-xl bg-[#141414] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {isFinalizing ? 'Finalizando...' : 'Finalizar venta'}
        </button>
      </div>
    </footer>
  );
}

