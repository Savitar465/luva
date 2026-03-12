import { ConeIcon, ContainerIcon, CupIcon } from '@/public/icons';
import type { PedidoIconComponent } from '@/features/pedidos/types';

export function resolvePedidoIcon(nombre: string): PedidoIconComponent {
  const normalizedName = nombre.toLowerCase();

  if (normalizedName.includes('cono')) {
    return ConeIcon;
  }

  if (normalizedName.includes('vaso') || normalizedName.includes('copa')) {
    return CupIcon;
  }

  return ContainerIcon;
}

