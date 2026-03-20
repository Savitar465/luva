import {
  ConeIcon,
  MiniDeliIcon,
  QuarterKgIcon,
  HalfKgIcon,
  SimpleIcon,
  DobleIcon,
  TripleIcon,
  SimpleSAIcon,
  DobleSAIcon,
  TripleSAIcon,
  MagnumIcon,
  MedianaIcon,
  EspecialIcon,
  SandwichIcon,
  BananaSplitIcon,
  OneKgIcon,
  FrutiPaletasIcon,
  HalfKgSAIcon,
  QuarterKgSAIcon,
  OneKgSAIcon,
} from '@/public/icons';
import type { PedidoIconComponent } from '@/features/pedidos/types';

export function resolvePedidoIcon(nombre: string): PedidoIconComponent {
  const n = nombre.toLowerCase().trim();
  const isSA = n.includes('s/a') || n.includes('sin azucar') || n.includes('sin azúcar');

  if (isSA) {
    if (n.includes('triple'))            return TripleSAIcon;
    if (n.includes('doble'))             return DobleSAIcon;
    if (n.includes('simple'))            return SimpleSAIcon;
    if (n.includes('1 kg') || n.includes('1kg')) return OneKgSAIcon;
    if (n.includes('1/2'))               return HalfKgSAIcon;
    if (n.includes('1/4'))               return QuarterKgSAIcon;
    return SimpleSAIcon; // generic S/A fallback
  }

  if (n.includes('cono'))                          return ConeIcon;
  if (n.includes('mini deli') || n.includes('minideli')) return MiniDeliIcon;
  if (n.includes('1/4'))                           return QuarterKgIcon;
  if (n.includes('1/2'))                           return HalfKgIcon;
  if (n.includes('1 kg') || n.includes('1kg'))     return OneKgIcon;
  if (n.includes('simple'))                        return SimpleIcon;
  if (n.includes('doble'))                         return DobleIcon;
  if (n.includes('triple'))                        return TripleIcon;
  if (n.includes('magnum'))                        return MagnumIcon;
  if (n.includes('mediana'))                       return MedianaIcon;
  if (n.includes('especial'))                      return EspecialIcon;
  if (n.includes('sandwich'))                      return SandwichIcon;
  if (n.includes('banana'))                        return BananaSplitIcon;
  if (n.includes('fruti') || n.includes('paleta')) return FrutiPaletasIcon;

  return HalfKgIcon; // default fallback
}
