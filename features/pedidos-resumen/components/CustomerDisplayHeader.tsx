import { IceCreamIcon } from '@/public/icons';

interface CustomerDisplayHeaderProps {
  realtimeStatus: 'CONNECTED' | 'DISCONNECTED';
  vendorPin?: string;
}

export function CustomerDisplayHeader({ realtimeStatus, vendorPin }: CustomerDisplayHeaderProps) {
  const isConnected = realtimeStatus === 'CONNECTED';

  return (
    <header className="pb-4 sm:pb-6">
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
        <div className="flex items-center gap-4">
          <div className="text-[#141414]">
            <IceCreamIcon aria-hidden="true" style={{ width: '32px', height: '40px' }} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#141414] sm:text-4xl lg:text-5xl">
              Tu pedido en preparacion
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              {vendorPin ? `Mostrando pedidos del vendedor ${vendorPin}` : 'Los productos aparecen aqui en tiempo real'}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] sm:text-sm ${
            isConnected
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-amber-200 bg-amber-50 text-amber-700'
          }`}
        >
          {isConnected ? 'En vivo' : 'Reconectando'}
        </div>
      </div>
    </header>
  );
}

