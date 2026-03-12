import { IceCreamIcon } from '@/public/icons';
import { VendorPinForm } from '@/features/pedidos/components/VendorPinForm';

interface PedidoHeaderProps {
  vendorPinInput: string;
  activeVendorPin: string;
  onVendorPinChange: (value: string) => void;
  onSaveVendorPin: () => void;
}

export function PedidoHeader({
  vendorPinInput,
  activeVendorPin,
  onVendorPinChange,
  onSaveVendorPin,
}: PedidoHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-gray-100 px-6 pt-6 pb-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-3">
        <div className="shrink-0 text-[#141414]">
          <IceCreamIcon />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#141414]">Nuevo Pedido</h1>
          <p className="text-sm text-gray-500">Sincronizacion en tiempo real con pantalla cliente</p>
        </div>
      </div>

      <VendorPinForm
        value={vendorPinInput}
        activeVendorPin={activeVendorPin}
        onChange={onVendorPinChange}
        onSave={onSaveVendorPin}
      />
    </header>
  );
}

