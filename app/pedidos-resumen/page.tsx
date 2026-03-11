'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContainerIcon, CupIcon, IceCreamIcon, ConeIcon } from '@/public/icons';
import { getLatestPedidoActivoView } from '@/lib/services/pedidos';
import { subscribePedidosRealtime } from '@/lib/services/pedidosRealtime';
import { PedidoActivoView } from '@/app/pedidos/types';

function iconForItemName(nombre: string) {
  const normalized = nombre.toLowerCase();
  if (normalized.includes('cono')) return ConeIcon;
  if (normalized.includes('vaso') || normalized.includes('copa')) return CupIcon;
  return ContainerIcon;
}

export default function PedidosResumenPage() {
  const [pedido, setPedido] = useState<PedidoActivoView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');

  const loadPedido = useCallback(async () => {
    const snapshot = await getLatestPedidoActivoView();
    setPedido(snapshot);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        await loadPedido();
        setError(null);
      } catch (err) {
        console.error('Error loading customer display:', err);
        setError('No se pudo cargar el pedido en pantalla.');
      } finally {
        setLoading(false);
      }
    }

    init();

    const unsubscribe = subscribePedidosRealtime(
      () => {
        loadPedido().catch((realtimeError) => {
          console.error('Error refreshing realtime customer display:', realtimeError);
        });
      },
      setRealtimeStatus,
    );

    return () => unsubscribe();
  }, [loadPedido]);

  const total = useMemo(() => Number(pedido?.total ?? 0), [pedido]);

  return (
    <div className="order-page">
      <div className="dot-pattern" aria-hidden="true" />

      <div className="order-container">
        <header className="order-header-wrapper">
          <div className="order-header">
            <div className="brand">
              <IceCreamIcon aria-hidden="true" style={{ color: '#141414' }} />
              <h1 className="brand-name">Tu pedido en preparacion</h1>
            </div>
            <div className="order-badge">
              {realtimeStatus === 'CONNECTED' ? 'EN VIVO' : 'RECONECTANDO'}
            </div>
          </div>
        </header>

        {loading && (
          <div className="order-item">
            <p className="item-description">Cargando pedido...</p>
          </div>
        )}

        {error && !loading && (
          <div className="order-item" style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
            <p className="item-description" style={{ color: '#b91c1c' }}>{error}</p>
          </div>
        )}

        {!loading && !error && (!pedido || pedido.items.length === 0) && (
          <div className="order-item" style={{ minHeight: 220, alignItems: 'center', justifyContent: 'center' }}>
            <p className="item-name">Esperando seleccion de productos...</p>
          </div>
        )}

        {!loading && !error && pedido && pedido.items.length > 0 && (
          <ul className="order-list">
            {pedido.items.map((item) => {
              const Icon = iconForItemName(item.nombre);

              return (
                <li className="order-item" key={item.id}>
                  <div className="item-left">
                    <div className="item-icon">
                      <Icon aria-hidden="true" style={{ color: '#141414' }} />
                    </div>
                    <div className="item-details">
                      <h2 className="item-name">{item.nombre}</h2>
                      <p className="item-description">
                        Cantidad: {item.cantidad} x ${item.precioUnit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="item-price">${item.subtotal.toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="total-footer-wrapper">
          <div className="total-footer">
            <div className="total-label-group">
              <span className="total-label">Total actual</span>
              <span className="total-sublabel">
                Pedido #{pedido?.id ?? '-'} {pedido?.vendedorPin ? `• Vendedor ${pedido.vendedorPin}` : ''}
              </span>
            </div>
            <span className="total-amount">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
