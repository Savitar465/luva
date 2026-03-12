interface VendorPinFormProps {
  value: string;
  activeVendorPin: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function VendorPinForm({ value, activeVendorPin, onChange, onSave }: VendorPinFormProps) {
  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm uppercase"
          placeholder="PIN vendedor"
        />
        <button
          onClick={onSave}
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          Guardar PIN
        </button>
      </div>
      <span className="text-xs text-gray-500">PIN activo: {activeVendorPin}</span>
    </div>
  );
}

