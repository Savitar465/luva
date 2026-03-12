import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { PedidoActivoView, PedidoItemView, ProductoDB } from '@/lib/types/pedidos';

type Pedido = Database['public']['Tables']['pedidos']['Row'];
type PedidoInsert = Database['public']['Tables']['pedidos']['Insert'];

type DetalleWithProducto = {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unit: number;
  subtotal: number | null;
  productos: {
    id: number;
    nombre: string;
    tipo: string;
  } | null;
};

type DetalleSubtotalRow = {
  cantidad: number;
  precio_unit: number;
  subtotal: number | null;
};

const DEFAULT_FORMA_PAGO_ID = 1;

function toItemView(row: DetalleWithProducto): PedidoItemView {
  return {
    id: row.id,
    productoId: row.producto_id,
    nombre: row.productos?.nombre ?? `Producto #${row.producto_id}`,
    cantidad: row.cantidad,
    precioUnit: Number(row.precio_unit),
    subtotal: Number(row.subtotal ?? row.cantidad * row.precio_unit),
    tipo: row.productos?.tipo ?? 'presentacion',
  };
}

async function getPedidoItems(pedidoId: number) {
  const { data, error } = await supabase
    .from('detalle_pedidos')
    .select('id,pedido_id,producto_id,cantidad,precio_unit,subtotal,productos(id,nombre,tipo)')
    .eq('pedido_id', pedidoId)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching detalle_pedidos:', error);
    throw error;
  }

  return (data ?? []) as DetalleWithProducto[];
}

async function getPedidoSubtotalRows(pedidoId: number) {
  const { data, error } = await supabase
    .from('detalle_pedidos')
    .select('cantidad,precio_unit,subtotal')
    .eq('pedido_id', pedidoId);

  if (error) {
    console.error('Error fetching detalle_pedidos subtotals:', error);
    throw error;
  }

  return (data ?? []) as DetalleSubtotalRow[];
}

export async function syncPedidoTotal(pedidoId: number) {
  const rows = await getPedidoSubtotalRows(pedidoId);
  const total = rows.reduce((acc, row) => acc + Number(row.subtotal ?? row.cantidad * row.precio_unit), 0);

  const { error } = await supabase
    .from('pedidos')
    .update({ total })
    .eq('id', pedidoId);

  if (error) {
    console.error('Error syncing pedido total:', error);
    throw error;
  }

  return total;
}

export async function createPedido(pedido: PedidoInsert) {
  const { data, error } = await supabase.from('pedidos').insert(pedido).select().single();

  if (error) {
    console.error('Error creating pedido:', error);
    throw error;
  }

  return data as Pedido;
}

export async function getPedidoActivo(vendedorPin: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('estado', 'en_proceso')
    .eq('vendedor_pin', vendedorPin)
    .order('creado_en', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching active pedido:', error);
    throw error;
  }

  return data as Pedido | null;
}

export async function ensurePedidoActivo(vendedorPin: string) {
  const existing = await getPedidoActivo(vendedorPin);
  if (existing) {
    return existing;
  }

  return createPedido({
    forma_pago_id: DEFAULT_FORMA_PAGO_ID,
    vendedor_pin: vendedorPin,
    estado: 'en_proceso',
    total: 0,
  });
}

export async function getPedidoActivoView(vendedorPin: string): Promise<PedidoActivoView> {
  const pedido = await ensurePedidoActivo(vendedorPin);
  const rows = await getPedidoItems(pedido.id);

  return {
    id: pedido.id,
    vendedorPin: pedido.vendedor_pin,
    estado: pedido.estado,
    creadoEn: pedido.creado_en,
    total: Number(pedido.total),
    items: rows.map(toItemView),
  };
}

export async function getLatestPedidoActivoView(vendedorPin?: string): Promise<PedidoActivoView | null> {
  let query = supabase
    .from('pedidos')
    .select('*')
    .eq('estado', 'en_proceso');

  if (vendedorPin) {
    query = query.eq('vendedor_pin', vendedorPin);
  }

  const { data, error } = await query
    .order('creado_en', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching latest active pedido:', error);
    throw error;
  }

  if (!data) {
    return null;
  }

  const rows = await getPedidoItems(data.id);

  return {
    id: data.id,
    vendedorPin: data.vendedor_pin,
    estado: data.estado,
    creadoEn: data.creado_en,
    total: Number(data.total),
    items: rows.map(toItemView),
  };
}

export async function addOrIncrementItem(
  pedidoId: number,
  producto: ProductoDB,
  quantityDelta = 1,
  shouldSyncTotal = true,
) {
  const normalizedQuantityDelta = Number.isFinite(quantityDelta)
    ? Math.max(1, Math.trunc(quantityDelta))
    : 1;
  const precioUnit = Number(producto.precio_unitario);

  const { data: existing, error: existingError } = await supabase
    .from('detalle_pedidos')
    .select('id,cantidad,precio_unit')
    .eq('pedido_id', pedidoId)
    .eq('producto_id', producto.id)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking existing order item:', existingError);
    throw existingError;
  }

  if (existing) {
    const nextCantidad = existing.cantidad + normalizedQuantityDelta;

    const { error } = await supabase
      .from('detalle_pedidos')
      .update({
        cantidad: nextCantidad,
      })
      .eq('id', existing.id);

    if (error) {
      console.error('Error incrementing order item:', error);
      throw error;
    }
  } else {
    const { error } = await supabase
      .from('detalle_pedidos')
      .insert({
        pedido_id: pedidoId,
        producto_id: producto.id,
        cantidad: normalizedQuantityDelta,
        precio_unit: precioUnit,
      });

    if (error) {
      console.error('Error adding order item:', error);
      throw error;
    }
  }

  if (shouldSyncTotal) {
    await syncPedidoTotal(pedidoId);
  }
}

export async function decrementOrRemoveItem(pedidoId: number, productoId: number) {
  const { data: existing, error: existingError } = await supabase
    .from('detalle_pedidos')
    .select('id,cantidad')
    .eq('pedido_id', pedidoId)
    .eq('producto_id', productoId)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking existing order item:', existingError);
    throw existingError;
  }

  if (!existing) {
    return;
  }

  if (existing.cantidad <= 1) {
    const { error } = await supabase
      .from('detalle_pedidos')
      .delete()
      .eq('id', existing.id);

    if (error) {
      console.error('Error removing order item:', error);
      throw error;
    }
  } else {
    const { error } = await supabase
      .from('detalle_pedidos')
      .update({ cantidad: existing.cantidad - 1 })
      .eq('id', existing.id);

    if (error) {
      console.error('Error decrementing order item:', error);
      throw error;
    }
  }

  await syncPedidoTotal(pedidoId);
}

export async function removeItem(pedidoId: number, productoId: number) {
  const { error } = await supabase
    .from('detalle_pedidos')
    .delete()
    .eq('pedido_id', pedidoId)
    .eq('producto_id', productoId);

  if (error) {
    console.error('Error deleting order item:', error);
    throw error;
  }

  await syncPedidoTotal(pedidoId);
}

export async function finalizePedido(pedidoId: number, vendedorPin: string, formaPagoId = DEFAULT_FORMA_PAGO_ID) {
  const total = await syncPedidoTotal(pedidoId);

  const { data, error } = await supabase
    .from('pedidos')
    .update({
      estado: 'completado',
      forma_pago_id: formaPagoId,
      vendedor_pin: vendedorPin,
      total,
    })
    .eq('id', pedidoId)
    .select('*')
    .single();

  if (error) {
    console.error('Error finalizing pedido:', error);
    throw error;
  }

  return data as Pedido;
}