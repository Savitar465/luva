import { Database } from '@/lib/supabase/types';

export type ProductoDB = Database['public']['Tables']['productos']['Row'];

export interface Presentation {
  id: number;
  name: string;
  basePrice: number;
  icon: React.ComponentType;
  dbProduct?: ProductoDB;
}
