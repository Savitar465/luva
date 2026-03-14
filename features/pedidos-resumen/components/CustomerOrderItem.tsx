import type { PedidoItemView } from '@/lib/types/pedidos';
import { ConeIcon, ContainerIcon, CupIcon } from '@/public/icons';

interface CustomerOrderItemProps {
  item: PedidoItemView;
}

export function CustomerOrderItem({ item }: CustomerOrderItemProps) {
  const normalizedName = item.nombre.toLowerCase();
  const iconNode = normalizedName.includes('cono') ? (
    <ConeIcon aria-hidden="true" style={{ width: '28px', height: '28px' }} />
  ) : normalizedName.includes('vaso') || normalizedName.includes('copa') ? (
    <CupIcon aria-hidden="true" style={{ width: '28px', height: '28px' }} />
  ) : (
    <ContainerIcon aria-hidden="true" style={{ width: '28px', height: '28px' }} />
  );

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/5 text-[#141414] sm:h-16 sm:w-16">
          {iconNode}
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#141414] sm:text-2xl">{item.nombre}</h2>
          <p className="text-sm font-medium text-slate-500 sm:text-lg">
            Cantidad: {item.cantidad} x Bs. {item.precioUnit.toFixed(2)}
          </p>
        </div>
      </div>

      <span className="text-2xl font-bold text-[#141414] sm:text-3xl">Bs. {item.subtotal.toFixed(2)}</span>
    </li>
  );
}


