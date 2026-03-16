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

type PendingAddInput = {
  producto: ProductoDB;
  count: number;
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

export async function getActiveVendorPins(limit = 100): Promise<string[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select('vendedor_pin,creado_en')
    .eq('estado', 'en_proceso')
    .order('creado_en', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching active vendor pins:', error);
    throw error;
  }

  const uniquePins = new Set<string>();

  (data ?? []).forEach((row) => {
    const normalized = row.vendedor_pin?.trim().toUpperCase();
    if (normalized) {
      uniquePins.add(normalized);
    }
  });

  return [...uniquePins];
}

export async function addOrIncrementItem(
  pedidoId: number,
  producto: ProductoDB,
  quantityDelta = 1,
  shouldSyncTotal = true,
) {
  await addOrIncrementItemsBatch(
    pedidoId,
    [{ producto, count: quantityDelta }],
    shouldSyncTotal,
  );
}

export async function addOrIncrementItemsBatch(
  pedidoId: number,
  additions: PendingAddInput[],
  shouldSyncTotal = true,
) {
  const normalized = additions
    .map((entry) => ({
      producto: entry.producto,
      count: Number.isFinite(entry.count) ? Math.max(1, Math.trunc(entry.count)) : 1,
    }))
    .filter((entry) => entry.count > 0);

  if (normalized.length === 0) {
    return;
  }

  const productIds = normalized.map((entry) => entry.producto.id);
  const { data: existingRows, error: existingError } = await supabase
    .from('detalle_pedidos')
    .select('id,producto_id,cantidad')
    .eq('pedido_id', pedidoId)
    .in('producto_id', productIds);

  if (existingError) {
    console.error('Error checking existing order items:', existingError);
    throw existingError;
  }

  const existingByProductId = new Map<number, { id: number; cantidad: number }>(
    (existingRows ?? []).map((row) => [row.producto_id, { id: row.id, cantidad: row.cantidad }]),
  );

  const updates: PromiseLike<unknown>[] = [];
  const inserts: Database['public']['Tables']['detalle_pedidos']['Insert'][] = [];

  normalized.forEach(({ producto, count }) => {
    const existing = existingByProductId.get(producto.id);

    if (existing) {
      updates.push(
        supabase
          .from('detalle_pedidos')
          .update({ cantidad: existing.cantidad + count })
          .eq('id', existing.id)
          .then(({ error }) => {
            if (error) {
              throw error;
            }
          }),
      );
      return;
    }

    inserts.push({
      pedido_id: pedidoId,
      producto_id: producto.id,
      cantidad: count,
      precio_unit: Number(producto.precio_unitario),
    });
  });

  if (inserts.length > 0) {
    updates.push(
      supabase
        .from('detalle_pedidos')
        .insert(inserts)
        .then(({ error }) => {
          if (error) {
            throw error;
          }
        }),
    );
  }

  if (updates.length > 0) {
    try {
      await Promise.all(updates);
    } catch (error) {
      console.error('Error applying order item batch:', error);
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

export async function cancelPedido(pedidoId: number, vendedorPin: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({
      estado: 'anulado',
      vendedor_pin: vendedorPin,
    })
    .eq('id', pedidoId)
    .select('*')
    .single();

  if (error) {
    console.error('Error canceling pedido:', error);
    throw error;
  }

  return data as Pedido;
}

