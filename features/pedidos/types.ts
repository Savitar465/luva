import type { ComponentType, SVGProps } from 'react';
import type { ProductoDB } from '@/lib/types/pedidos';

export type PedidoIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface PresentationViewModel {
  id: number;
  name: string;
  basePrice: number;
  icon: PedidoIconComponent;
  dbProduct: ProductoDB;
}

