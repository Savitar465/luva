import type { PedidoItemView } from '@/lib/types/pedidos';

interface CurrentOrderPanelProps {
  items: PedidoItemView[];
}

export function CurrentOrderPanel({ items }: CurrentOrderPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <h3 className="mb-3 text-lg font-semibold text-[#141414]">Pedido actual</h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Aun no hay productos en el pedido.</p>
      ) : (
        <ul className="max-h-96 space-y-2 overflow-auto pr-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
            >
              <div>
                <p className="text-base font-semibold text-[#141414]">{item.nombre}</p>
                <p className="text-sm text-gray-500">
                  {item.cantidad} x ${item.precioUnit.toFixed(2)}
                </p>
              </div>
              <p className="text-base font-semibold text-[#141414]">${item.subtotal.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

