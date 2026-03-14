interface CustomerTotalFooterProps {
  total: number;
  pedidoId?: number | null;
  vendedorPin?: string | null;
}

export function CustomerTotalFooter({ total, pedidoId, vendedorPin }: Readonly<CustomerTotalFooterProps>) {
  return (
    <footer className="mt-auto">
      <div className="flex flex-col gap-4 rounded-2xl bg-[#141414] p-6 text-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium uppercase tracking-[0.24em] text-white/70 sm:text-base">
            Total actual
          </span>
          <span className="text-sm text-white/50">
            Pedido #{pedidoId ?? '-'} {vendedorPin ? `• Vendedor ${vendedorPin}` : ''}
          </span>
        </div>
        <span className="text-5xl font-extrabold leading-none tracking-[-0.05em] sm:text-6xl lg:text-8xl">
          Bs. {total.toFixed(2)}
        </span>
      </div>
    </footer>
  );
}

