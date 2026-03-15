import type { PedidoItemView } from '@/lib/types/pedidos';

interface CurrentOrderPanelProps {
  items: PedidoItemView[];
  disableActions?: boolean;
  onRemoveItem: (productoId: number) => void;
}

export function CurrentOrderPanel({ items, disableActions = false, onRemoveItem }: Readonly<CurrentOrderPanelProps>) {
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
                  {item.cantidad} x Bs. {item.precioUnit.toFixed(2)}
                </p>
              </div>
              <p className="text-base font-semibold text-[#141414]">Bs. {item.subtotal.toFixed(2)}</p>
              <button className="rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-200 disabled:opacity-40 disabled:hover:bg-transparent"
                        type="button"
                        onClick={() => onRemoveItem(item.productoId)}
                        disabled={disableActions}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

