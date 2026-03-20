import { memo } from 'react';
import type { PresentationViewModel } from '@/features/pedidos/types';

interface PresentationCardProps {
  presentation: PresentationViewModel;
  quantity: number;
  isJustAdded: boolean;
  disabled?: boolean;
  onAdd: (presentation: PresentationViewModel) => void;
}

function PresentationCardComponent({
  presentation,
  quantity,
  isJustAdded,
  disabled = false,
  onAdd,
}: Readonly<PresentationCardProps>) {
  const Icon = presentation.icon;

  return (
    <button
      onClick={() => onAdd(presentation)}
      disabled={disabled}
      className={`min-h-36 rounded-2xl border bg-gray-50 p-5 text-left transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
        isJustAdded
          ? 'pos-added-pop border-[#35AFB4] bg-[#e6f6f7] shadow-[0_0_0_3px_rgba(53,175,180,0.20)]'
          : 'border-gray-200 hover:border-[#8fd1d4] hover:bg-[#f2fbfb]'
      }`}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d8eaec] bg-white text-[#241E20]">
              <Icon />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#241E20]">{presentation.name}</h3>
              <p className="text-base text-gray-600">${presentation.basePrice.toFixed(2)}</p>
            </div>
          </div>
          {quantity > 0 ? (
            <span
              className={`rounded-lg px-3 py-1 text-sm font-bold ${
                isJustAdded ? 'animate-pulse bg-[#35AFB4] text-white' : 'bg-[#241E20] text-white'
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

export const PresentationCard = memo(PresentationCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.presentation === nextProps.presentation
    && prevProps.quantity === nextProps.quantity
    && prevProps.isJustAdded === nextProps.isJustAdded
    && prevProps.disabled === nextProps.disabled
    && prevProps.onAdd === nextProps.onAdd
  );
});

