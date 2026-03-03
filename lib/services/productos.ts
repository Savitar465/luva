import { supabase } from '../supabase/client';
import { Database } from '../supabase/types';

type Producto = Database['public']['Tables']['productos']['Row'];

/**
 * Obtiene todos los productos activos filtrados por tipo
 */
export async function getProductosByTipo(tipo: 'sabor' | 'topping' | 'presentacion') {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('tipo', tipo)
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (error) {
    console.error(`Error fetching productos tipo ${tipo}:`, error);
    throw error;
  }

  return data as Producto[];
}

/**
 * Obtiene todas las presentaciones activas
 */
export async function getPresentaciones() {
  return getProductosByTipo('presentacion');
}

/**
 * Obtiene todos los sabores activos
 */
export async function getSabores() {
  return getProductosByTipo('sabor');
}

/**
 * Obtiene todos los toppings activos
 */
export async function getToppings() {
  return getProductosByTipo('topping');
}

/**
 * Obtiene un producto por su ID
 */
export async function getProductoById(id: number) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching producto ${id}:`, error);
    throw error;
  }

  return data as Producto;
}

/**
 * Crea un nuevo producto
 */
export async function createProducto(
  producto: Database['public']['Tables']['productos']['Insert']
) {
  const { data, error } = await supabase
    .from('productos')
    .insert(producto)
    .select()
    .single();

  if (error) {
    console.error('Error creating producto:', error);
    throw error;
  }

  return data as Producto;
}

/**
 * Actualiza un producto existente
 */
export async function updateProducto(
  id: number,
  updates: Database['public']['Tables']['productos']['Update']
) {
  const { data, error } = await supabase
    .from('productos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating producto ${id}:`, error);
    throw error;
  }

  return data as Producto;
}

/**
 * Desactiva un producto (soft delete)
 */
export async function deactivateProducto(id: number) {
  return updateProducto(id, { activo: false });
}
