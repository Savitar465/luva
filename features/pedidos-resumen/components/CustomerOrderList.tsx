import type { PedidoItemView } from '@/lib/types/pedidos';
import {CustomerOrderItem} from "@/features/pedidos-resumen/components/CustomerOrderItem";


interface CustomerOrderListProps {
  items: PedidoItemView[];
}

export function CustomerOrderList({ items }: CustomerOrderListProps) {
  return (
    <ul className="flex list-none flex-col gap-4 pb-6 sm:gap-6 sm:pb-8">
      {items.map((item) => (
        <CustomerOrderItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

