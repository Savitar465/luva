'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/features/shared/ui/LoadingSpinner';
import {usePedidoResumen} from "@/features/pedidos-resumen/hooks/usePedidoResumen";
import {CustomerDisplayHeader} from "@/features/pedidos-resumen/components/CustomerDisplayHeader";
import {CustomerOrderList} from "@/features/pedidos-resumen/components/CustomerOrderList";
import {CustomerTotalFooter} from "@/features/pedidos-resumen/components/CustomerTotalFooter";


function DisplayStateCard({
  title,
  description,
  tone = 'neutral',
}: {
  title: string;
  description?: string;
  tone?: 'neutral' | 'error';
}) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm sm:p-8 ${
        tone === 'error'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-black/5 bg-white text-[#141414]'
      }`}
    >
      <p className="text-xl font-semibold sm:text-2xl">{title}</p>
      {description ? <p className="mt-2 text-sm text-current/70 sm:text-base">{description}</p> : null}
    </div>
  );
}

export function PedidoResumenScreen() {
  const searchParams = useSearchParams();
  const vendorPinParam = useMemo(() => searchParams.get('vendor'), [searchParams]);
  const { pedido, loading, error, realtimeStatus, total, vendorPin } = usePedidoResumen({
    vendorPin: vendorPinParam,
  });

  return (
    <div className="relative flex min-h-screen justify-center overflow-hidden bg-[#F7F7F7]">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          background:
            'radial-gradient(70.71% 70.71% at 50% 50%, #141414 1.77%, rgba(20, 20, 20, 0) 1.77%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <CustomerDisplayHeader realtimeStatus={realtimeStatus} vendorPin={vendorPin} />

        {loading ? (
          <div className="rounded-2xl border border-black/5 bg-white px-6 py-10 shadow-sm sm:px-8 sm:py-12">
            <LoadingSpinner label="Cargando pedido..." sizeClassName="h-10 w-10" />
          </div>
        ) : null}

        {!loading && error ? (
          <DisplayStateCard title={error} description="Revisa la conexion y vuelve a intentar." tone="error" />
        ) : null}

        {!loading && !error && (!pedido || pedido.items.length === 0) ? (
          <DisplayStateCard
            title="Esperando seleccion de productos..."
            description="El vendedor puede empezar a agregar conos, vasos o porciones y apareceran aqui al instante."
          />
        ) : null}

        {!loading && !error && pedido && pedido.items.length > 0 ? (
          <CustomerOrderList items={pedido.items} />
        ) : null}

        <CustomerTotalFooter total={total} pedidoId={pedido?.id} vendedorPin={pedido?.vendedorPin ?? vendorPin} />
      </div>
    </div>
  );
}

