'use client';

import { useState, useEffect } from 'react';
import { getPresentaciones } from '@/lib/services/productos';
import { getIconForPresentation } from './data';
import { IceCreamIcon } from '@/public/icons';
import { Presentation } from './types';

export default function PedidoPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPresentation, setSelectedPresentation] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadPresentaciones() {
      try {
        setLoading(true);
        const productos = await getPresentaciones();

        const presentationsData: Presentation[] = productos.map((producto) => ({
          id: producto.id,
          name: producto.nombre,
          basePrice: Number(producto.precio_unitario),
          icon: getIconForPresentation(producto.nombre),
          dbProduct: producto,
        }));

        setPresentations(presentationsData);
        setError(null);
      } catch (err) {
        console.error('Error loading presentations:', err);
        setError('Error al cargar las presentaciones');
      } finally {
        setLoading(false);
      }
    }

    loadPresentaciones();
  }, []);

  const handlePresentationSelect = (presentation: Presentation) => {
    setSelectedPresentation(presentation.id);
    setTotal(presentation.basePrice);
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#f8f7ff] to-[#fef4f4] p-4 flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden="true" />

      <div className="relative w-full max-w-120 bg-white rounded-3xl shadow-md overflow-hidden flex flex-col min-h-150">
        {/* Header */}
        <header className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="shrink-0 text-[#141414]">
              <IceCreamIcon />
            </div>
            <h1 className="text-xl font-semibold text-[#141414]">Nuevo Pedido</h1>
          </div>
        </header>

        {/* Presentation Selection */}
        <section className="px-6 py-6 flex-1">
          <h2 className="text-base font-semibold text-[#141414] mb-4">Seleccione la presentación</h2>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && presentations.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
              No hay presentaciones disponibles. Por favor, agregue productos en la base de datos.
            </div>
          )}

          {!loading && !error && presentations.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {presentations.map((presentation) => {
                const Icon = presentation.icon;
                return (
                  <button
                    key={presentation.id}
                    className={`flex flex-col items-center gap-3 px-4 py-6 rounded-2xl border-2 transition-all ${
                      selectedPresentation === presentation.id
                        ? 'bg-blue-50 border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-0.5'
                    }`}
                    onClick={() => handlePresentationSelect(presentation)}
                  >
                    <div className={`w-12 h-12 flex items-center justify-center transition-colors ${
                      selectedPresentation === presentation.id ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      <Icon />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="text-base font-semibold text-[#141414] mb-1">{presentation.name}</h3>
                      <p className={`text-sm font-medium ${
                        selectedPresentation === presentation.id ? 'text-blue-500' : 'text-gray-500'
                      }`}>
                        ${presentation.basePrice.toFixed(2)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Flavor Selection (shown after presentation is selected) */}
        {selectedPresentation && (
          <section className="px-6 pb-6 pt-6 border-t border-gray-100">
            <h2 className="text-base font-semibold text-[#141414] mb-2">Seleccione los sabores</h2>
            <p className="text-sm text-gray-500">Próximamente: selección de sabores</p>
          </section>
        )}

        {/* Total Footer */}
        <div className="flex items-center justify-between px-6 py-6 bg-gray-50 border-t border-gray-200 mt-auto">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#141414]">Total Parcial</span>
            <span className="text-xs text-gray-500">Impuestos incluidos</span>
          </div>
          <span className="text-2xl font-bold text-[#141414]">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
