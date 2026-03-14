import type { PresentationViewModel } from '@/features/pedidos/types';
import { resolvePedidoIcon } from '@/features/shared/utils/iconResolver';
import { getPresentaciones } from '@/lib/services/productos';

export function toPresentationViewModel(
  producto: Awaited<ReturnType<typeof getPresentaciones>>[number],
): PresentationViewModel {
  return {
    id: producto.id,
    name: producto.nombre,
    basePrice: Number(producto.precio_unitario),
    icon: resolvePedidoIcon(producto.nombre),
    dbProduct: producto,
  };
}

export function normalizeCount(count: number) {
  return Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
}

