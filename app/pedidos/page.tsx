'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IceCreamIcon } from '@/public/icons';
import { getPresentaciones } from '@/lib/services/productos';
import {
  addOrIncrementItem,
  ensurePedidoActivo,
  finalizePedido,
  getPedidoActivoView,
} from '@/lib/services/pedidos';
import { subscribePedidosRealtime } from '@/lib/services/pedidosRealtime';
import { getIconForPresentation } from './data';
import { PedidoActivoView, Presentation } from './types';

const DEFAULT_VENDOR_PIN = 'VEND-01';
const VENDOR_PIN_STORAGE_KEY = 'luva.vendor_pin';

export default function PedidoPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [activeOrder, setActiveOrder] = useState<PedidoActivoView | null>(null);
  const [vendorPin, setVendorPin] = useState(DEFAULT_VENDOR_PIN);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');
  const [lastAddedPresentationId, setLastAddedPresentationId] = useState<number | null>(null);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);
  const clearFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPresentaciones = useCallback(async () => {
    const productos = await getPresentaciones();

    const presentationsData: Presentation[] = productos.map((producto) => ({
      id: producto.id,
      name: producto.nombre,
      basePrice: Number(producto.precio_unitario),
      icon: getIconForPresentation(producto.nombre),
      dbProduct: producto,
    }));

    setPresentations(presentationsData);
  }, []);

  const refreshActiveOrder = useCallback(async (pin: string) => {
    const snapshot = await getPedidoActivoView(pin);
    setActiveOrder(snapshot);
  }, []);

  useEffect(() => {
    const savedPin = window.localStorage.getItem(VENDOR_PIN_STORAGE_KEY);
    if (savedPin) {
      setVendorPin(savedPin);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        await loadPresentaciones();
        await ensurePedidoActivo(vendorPin);
        await refreshActiveOrder(vendorPin);
        setError(null);
      } catch (err) {
        console.error('Error initializing pedidos page:', err);
        setError('No se pudo cargar la pantalla de pedidos. Verifica tu conexion con Supabase.');
      } finally {
        setLoading(false);
      }
    }

    initialize();

    const unsubscribe = subscribePedidosRealtime(
      () => {
        refreshActiveOrder(vendorPin).catch((realtimeError) => {
          console.error('Error refreshing realtime order:', realtimeError);
        });
      },
      setRealtimeStatus,
    );

    return () => unsubscribe();
  }, [loadPresentaciones, refreshActiveOrder, vendorPin]);

  useEffect(() => {
    return () => {
      if (clearFeedbackTimerRef.current) {
        clearTimeout(clearFeedbackTimerRef.current);
      }
    };
  }, []);

  const qtyByPresentationId = useMemo(() => {
    const map = new Map<number, number>();
    activeOrder?.items.forEach((item) => {
      map.set(item.productoId, item.cantidad);
    });
    return map;
  }, [activeOrder]);

  const handleAdd = async (presentation: Presentation) => {
    if (!activeOrder || !presentation.dbProduct) return;

    try {
      setSaving(true);
      await addOrIncrementItem(activeOrder.id, presentation.dbProduct);
      await refreshActiveOrder(vendorPin);
      setLastAddedPresentationId(presentation.id);
      setAddFeedback(`${presentation.name} +1`);
      if (clearFeedbackTimerRef.current) {
        clearTimeout(clearFeedbackTimerRef.current);
      }
      clearFeedbackTimerRef.current = setTimeout(() => {
        setLastAddedPresentationId(null);
        setAddFeedback(null);
      }, 650);
      setError(null);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('No se pudo agregar el producto.');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    if (!activeOrder || activeOrder.items.length === 0) return;

    try {
      setSaving(true);
      await finalizePedido(activeOrder.id, vendorPin);
      await ensurePedidoActivo(vendorPin);
      await refreshActiveOrder(vendorPin);
      setError(null);
    } catch (err) {
      console.error('Error finalizing order:', err);
      setError('No se pudo finalizar el pedido.');
    } finally {
      setSaving(false);
    }
  };

  const saveVendorPin = async () => {
    const normalizedPin = vendorPin.trim().toUpperCase() || DEFAULT_VENDOR_PIN;
    window.localStorage.setItem(VENDOR_PIN_STORAGE_KEY, normalizedPin);
    setVendorPin(normalizedPin);
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#f8f7ff] to-[#fef4f4] p-3 sm:p-4 flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-md overflow-hidden flex flex-col min-h-[82vh]">
        <header className="px-6 pt-6 pb-4 border-b border-gray-100 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 text-[#141414]">
              <IceCreamIcon />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#141414]">Nuevo Pedido</h1>
              <p className="text-sm text-gray-500">Sincronizacion en tiempo real con pantalla cliente</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={vendorPin}
              onChange={(e) => setVendorPin(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm uppercase"
              placeholder="PIN vendedor"
            />
            <button
              onClick={saveVendorPin}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium"
            >
              Guardar PIN
            </button>
          </div>
        </header>

        <section className="px-6 py-4 border-b border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Estado realtime:{' '}
            <strong className={realtimeStatus === 'CONNECTED' ? 'text-emerald-600' : 'text-red-500'}>
              {realtimeStatus === 'CONNECTED' ? 'Conectado' : 'Desconectado'}
            </strong>
          </span>
          <span className="text-gray-500">Pedido activo #{activeOrder?.id ?? '-'}</span>
        </section>

        <section className="px-6 py-6 flex-1">
          <h2 className="text-lg font-semibold text-[#141414] mb-1">Presentaciones</h2>
          <p className="text-sm text-gray-500 mb-4">Modo POS: toca una tarjeta para sumar una unidad.</p>

          {addFeedback && (
            <div className="mb-4 inline-flex items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 text-sm font-semibold pos-toast-in">
              {addFeedback}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

          {!loading && presentations.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presentations.map((presentation) => {
                  const Icon = presentation.icon;
                  const qty = qtyByPresentationId.get(presentation.id) ?? 0;
                  const isJustAdded = lastAddedPresentationId === presentation.id;

                  return (
                    <button
                      key={presentation.id}
                      onClick={() => handleAdd(presentation)}
                      disabled={saving}
                      className={`min-h-36 bg-gray-50 border rounded-2xl p-5 flex flex-col gap-4 text-left transition-all active:scale-[0.98] disabled:opacity-60 ${
                        isJustAdded
                          ? 'border-emerald-400 bg-emerald-50/70 shadow-[0_0_0_3px_rgba(16,185,129,0.18)] pos-added-pop'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700">
                            <Icon />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#141414]">{presentation.name}</h3>
                            <p className="text-base text-gray-600">${presentation.basePrice.toFixed(2)}</p>
                          </div>
                        </div>
                        {qty > 0 && (
                          <span className={`px-3 py-1 rounded-lg text-sm font-bold ${isJustAdded ? 'bg-emerald-600 text-white animate-pulse' : 'bg-[#141414] text-white'}`}>
                            x{qty}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-auto">Toque rapido: +1 unidad</p>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-[#141414] mb-3">Pedido actual</h3>

                {(!activeOrder || activeOrder.items.length === 0) && (
                  <p className="text-sm text-gray-500">Aun no hay productos en el pedido.</p>
                )}

                {activeOrder && activeOrder.items.length > 0 && (
                  <ul className="space-y-2 max-h-[24rem] overflow-auto pr-1">
                    {activeOrder.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-base font-semibold text-[#141414]">{item.nombre}</p>
                          <p className="text-sm text-gray-500">{item.cantidad} x ${item.precioUnit.toFixed(2)}</p>
                        </div>
                        <p className="text-base font-semibold text-[#141414]">${item.subtotal.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        <footer className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-6 bg-gray-50 border-t border-gray-200 mt-auto">
          <div>
            <p className="text-sm font-semibold text-[#141414]">Total del pedido</p>
            <p className="text-xs text-gray-500">Se guarda y sincroniza en cada accion</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#141414]">${Number(activeOrder?.total ?? 0).toFixed(2)}</span>
            <button
              onClick={handleFinalize}
              disabled={saving || !activeOrder || activeOrder.items.length === 0}
              className="px-4 py-3 rounded-xl bg-[#141414] text-white text-sm font-semibold disabled:opacity-40"
            >
              Finalizar venta
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
