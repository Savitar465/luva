import Link from 'next/link';
import { getActiveVendorPins } from '@/lib/services/pedidos';

export default async function PedidosResumenSeleccionarPage() {
  let vendorPins: string[] = [];
  let loadError: string | null = null;

  try {
    vendorPins = await getActiveVendorPins();
  } catch (error) {
    console.error('Error loading active stores for customer display:', error);
    loadError = 'No se pudo cargar la lista de tiendas activas en este momento.';
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4fbfb] p-4">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          background:
            'radial-gradient(70.71% 70.71% at 50% 50%, #241E20 1.77%, rgba(36, 30, 32, 0) 1.77%)',
        }}
        aria-hidden="true"
      />

      <section className="relative z-10 w-full max-w-3xl rounded-3xl border border-[#d8eaec] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Pantalla cliente</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#241E20] sm:text-3xl">Selecciona la tienda antes de ingresar</h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Elige el codigo de tienda para mostrar solo el pedido correspondiente en tiempo real.
        </p>

        <form action="/pedidos-resumen" method="get" className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            name="vendor"
            placeholder="Codigo de tienda (ej: VEND-01)"
            className="h-11 rounded-xl border border-[#d8eaec] px-3 text-sm font-semibold uppercase text-[#241E20] outline-none transition-colors focus:border-[#35AFB4]"
            required
          />
          <button
            type="submit"
            className="h-11 rounded-xl bg-[#35AFB4] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2f9ca1]"
          >
            Ver pantalla
          </button>
        </form>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Tiendas activas</p>
          {loadError ? (
            <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {loadError} Puedes continuar ingresando el codigo manualmente.
            </p>
          ) : null}
          {vendorPins.length === 0 ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              No hay tiendas activas por ahora. Puedes ingresar un codigo manualmente.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {vendorPins.map((pin) => (
                <Link
                  key={pin}
                  href={`/pedidos-resumen?vendor=${encodeURIComponent(pin)}`}
                  className="rounded-xl border border-[#d8eaec] px-4 py-3 text-sm font-semibold text-[#241E20] transition-colors hover:border-[#9cd9dd] hover:bg-[#f2fbfb]"
                >
                  {pin}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-[#241E20]">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}


