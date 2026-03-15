'use client';

import { LoadingSpinner } from '@/features/shared/ui/LoadingSpinner';
import { CurrentOrderPanel } from '@/features/pedidos/components/CurrentOrderPanel';
import { PedidoFooter } from '@/features/pedidos/components/PedidoFooter';
import { PedidoHeader } from '@/features/pedidos/components/PedidoHeader';
import { PresentationGrid } from '@/features/pedidos/components/PresentationGrid';
import { RealtimeStatusBar } from '@/features/pedidos/components/RealtimeStatusBar';
import { usePedidoVendedor } from '@/features/pedidos/hooks/usePedidoVendedor';
import { useVendorPin } from '@/features/pedidos/hooks/useVendorPin';

export function PedidoVendedorScreen() {
  const {
    vendorPin,
    vendorPinInput,
    setVendorPinInput,
    persistVendorPin,
    isHydrated,
  } = useVendorPin();

  const {
    presentations,
    activeOrder,
    loading,
    isFinalizing,
    isCancelling,
    pendingAdds,
    error,
    lastAddedPresentationId,
    qtyByPresentationId,
    handleAdd,
    handleRemoveItem,
    handleCancelOrder,
    handleFinalize,
    canAddItems,
    canFinalize,
    canCancel,
  } = usePedidoVendedor({
    vendorPin,
    enabled: isHydrated,
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-[#f8f7ff] to-[#fef4f4] p-3 sm:p-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="relative flex min-h-[82vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-md">
        <PedidoHeader
          vendorPinInput={vendorPinInput}
          activeVendorPin={vendorPin}
          onVendorPinChange={setVendorPinInput}
          onSaveVendorPin={persistVendorPin}
        />

        <RealtimeStatusBar
          activeOrderId={activeOrder?.id}
          pendingAdds={pendingAdds}
        />

        <section className="flex-1 px-6 py-6">

          {!isHydrated || loading ? (
            <LoadingSpinner className="py-12" />
          ) : null}

          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
          ) : null}

          {!loading && presentations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
              <PresentationGrid
                presentations={presentations}
                qtyByPresentationId={qtyByPresentationId}
                lastAddedPresentationId={lastAddedPresentationId}
                canAddItems={canAddItems}
                onAdd={handleAdd}
              />

              <CurrentOrderPanel
                items={activeOrder?.items ?? []}
                disableActions={!canFinalize}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          ) : null}
        </section>

        <PedidoFooter
          total={Number(activeOrder?.total ?? 0)}
          disableFinalize={!canFinalize}
          disableCancel={!canCancel}
          pendingAdds={pendingAdds}
          isFinalizing={isFinalizing}
          isCancelling={isCancelling}
          onFinalize={handleFinalize}
          onCancel={handleCancelOrder}
        />
      </div>
    </div>
  );
}

