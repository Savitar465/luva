import { Database } from '@/lib/supabase/types';

export type ProductoDB = Database['public']['Tables']['productos']['Row'];
export interface PedidoItemView {
  id: number;
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
  tipo: string;
}

export interface PedidoActivoView {
  id: number;
  vendedorPin: string | null;
  estado: string | null;
  creadoEn: string | null;
  total: number;
  items: PedidoItemView[];
}

