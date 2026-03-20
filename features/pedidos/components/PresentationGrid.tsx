import type { PresentationViewModel } from '@/features/pedidos/types';
import { PresentationCard } from '@/features/pedidos/components/PresentationCard';

interface PresentationGridProps {
  presentations: PresentationViewModel[];
  qtyByPresentationId: Map<number, number>;
  lastAddedPresentationId: number | null;
  canAddItems: boolean;
  onAdd: (presentation: PresentationViewModel) => void;
}

export function PresentationGrid({
  presentations,
  qtyByPresentationId,
  lastAddedPresentationId,
  canAddItems,
  onAdd,
}: PresentationGridProps) {
  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold text-[#241E20]">Presentaciones</h2>
      <p className="mb-4 text-sm text-gray-500">Modo POS: toca una tarjeta para sumar una unidad.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {presentations.map((presentation) => (
          <PresentationCard
            key={presentation.id}
            presentation={presentation}
            quantity={qtyByPresentationId.get(presentation.id) ?? 0}
            isJustAdded={lastAddedPresentationId === presentation.id}
            disabled={!canAddItems}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
}

