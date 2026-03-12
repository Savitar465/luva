import type { PresentationViewModel } from '@/features/pedidos/types';

interface PresentationCardProps {
  presentation: PresentationViewModel;
  quantity: number;
  isJustAdded: boolean;
  disabled?: boolean;
  onAdd: (presentation: PresentationViewModel) => void;
}

export function PresentationCard({
  presentation,
  quantity,
  isJustAdded,
  disabled = false,
  onAdd,
}: PresentationCardProps) {
  const Icon = presentation.icon;

  return (
    <button
      onClick={() => onAdd(presentation)}
      disabled={disabled}
      className={`min-h-36 rounded-2xl border bg-gray-50 p-5 text-left transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
        isJustAdded
          ? 'pos-added-pop border-emerald-400 bg-emerald-50/70 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
      }`}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700">
              <Icon />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#141414]">{presentation.name}</h3>
              <p className="text-base text-gray-600">${presentation.basePrice.toFixed(2)}</p>
            </div>
          </div>
          {quantity > 0 ? (
            <span
              className={`rounded-lg px-3 py-1 text-sm font-bold ${
                isJustAdded ? 'animate-pulse bg-emerald-600 text-white' : 'bg-[#141414] text-white'
              }`}
            >
              x{quantity}
            </span>
          ) : null}
        </div>
        <p className="mt-auto text-sm text-gray-500">Toque rapido: +1 unidad</p>
      </div>
    </button>
  );
}

