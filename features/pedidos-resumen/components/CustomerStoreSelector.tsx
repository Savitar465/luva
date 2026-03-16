interface CustomerStoreSelectorProps {
  availableVendorPins: string[];
  selectedVendorPin: string;
  draftVendorPin: string;
  onDraftVendorPinChange: (value: string) => void;
  onSelectVendorPin: (value: string) => void;
  onApplyVendorPin: () => void;
  onClearVendorPin: () => void;
}

export function CustomerStoreSelector({
  availableVendorPins,
  selectedVendorPin,
  draftVendorPin,
  onDraftVendorPinChange,
  onSelectVendorPin,
  onApplyVendorPin,
  onClearVendorPin,
}: Readonly<CustomerStoreSelectorProps>) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="w-full">
          <p className="text-sm font-semibold text-[#141414]">Sincronizar pantalla cliente</p>
          <p className="mt-1 text-xs text-gray-500">Ingresa el codigo del vendedor o selecciona una tienda activa.</p>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-[1fr_auto_auto] md:max-w-2xl">
          <input
            type="text"
            value={draftVendorPin}
            onChange={(event) => onDraftVendorPinChange(event.target.value)}
            placeholder="Codigo (ej: VEND-01)"
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm font-medium uppercase text-[#141414] outline-none transition-colors focus:border-gray-400"
          />
          <button
            type="button"
            onClick={onApplyVendorPin}
            className="h-11 rounded-xl bg-[#141414] px-4 text-sm font-semibold text-white"
          >
            Conectar
          </button>
          <button
            type="button"
            onClick={onClearVendorPin}
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="customer-vendor-select" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Tiendas activas
        </label>
        <select
          id="customer-vendor-select"
          value={selectedVendorPin}
          onChange={(event) => onSelectVendorPin(event.target.value)}
          className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm font-medium text-[#141414] outline-none transition-colors focus:border-gray-400 sm:max-w-xs"
        >
          <option value="">Todas</option>
          {availableVendorPins.map((pin) => (
            <option key={pin} value={pin}>
              {pin}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

