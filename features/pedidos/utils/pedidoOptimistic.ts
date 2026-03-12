import type { PresentationViewModel } from '@/features/pedidos/types';
import type { PedidoActivoView, PedidoItemView } from '@/lib/types/pedidos';

function normalizeCount(count: number) {
  return Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
}

export function calculatePedidoTotal(items: PedidoItemView[]) {
  return items.reduce((sum, item) => sum + item.cantidad * item.precioUnit, 0);
}

export function incrementPedidoItem(
  pedido: PedidoActivoView,
  presentation: PresentationViewModel,
  count = 1,
): PedidoActivoView {
  const normalizedCount = normalizeCount(count);
  const itemIndex = pedido.items.findIndex((item) => item.productoId === presentation.id);

  const nextItems = [...pedido.items];

  if (itemIndex >= 0) {
    const currentItem = nextItems[itemIndex];
    const nextCantidad = currentItem.cantidad + normalizedCount;

    nextItems[itemIndex] = {
      ...currentItem,
      cantidad: nextCantidad,
      subtotal: nextCantidad * currentItem.precioUnit,
    };
  } else {
    nextItems.push({
      id: -presentation.id,
      productoId: presentation.id,
      nombre: presentation.name,
      cantidad: normalizedCount,
      precioUnit: presentation.basePrice,
      subtotal: normalizedCount * presentation.basePrice,
      tipo: presentation.dbProduct.tipo,
    });
  }

  return {
    ...pedido,
    items: nextItems,
    total: calculatePedidoTotal(nextItems),
  };
}

export function mergePendingAddsIntoPedido(
  pedido: PedidoActivoView | null,
  pendingAdds: ReadonlyMap<number, number>,
  presentationsById: ReadonlyMap<number, PresentationViewModel>,
) {
  if (!pedido || pendingAdds.size === 0) {
    return pedido;
  }

  let mergedPedido = pedido;

  pendingAdds.forEach((count, productId) => {
    if (count <= 0) {
      return;
    }

    const presentation = presentationsById.get(productId);
    if (!presentation) {
      return;
    }

    mergedPedido = incrementPedidoItem(mergedPedido, presentation, count);
  });

  return mergedPedido;
}


