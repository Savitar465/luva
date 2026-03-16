import { useEffect } from 'react';

interface DialogProps {
  open: boolean;
  labelledBy: string;
  describedBy?: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Dialog({ open, labelledBy, describedBy, onClose, children }: Readonly<DialogProps>) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    globalThis.addEventListener('keydown', onKeyDown);
    return () => {
      globalThis.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <dialog
      open
      className="fixed inset-0 z-50 m-0 flex h-screen w-screen max-h-none max-w-none items-center justify-center border-0 bg-transparent p-4"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
    >
      {children}
    </dialog>
  );
}

interface CancelOrderModalProps {
  open: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelOrderModal({
  open,
  loading = false,
  onConfirm,
  onClose,
}: Readonly<CancelOrderModalProps>) {
  return (
    <Dialog
      open={open}
      labelledBy="cancel-order-title"
      describedBy="cancel-order-description"
      onClose={onClose}
    >
      <button
        type="button"
        aria-label="Cerrar modal de cancelacion"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <h3 id="cancel-order-title" className="text-lg font-semibold text-[#141414]">
          Cancelar pedido actual
        </h3>
        <p id="cancel-order-description" className="mt-2 text-sm text-gray-600">
          Esta accion anulara todo el pedido en proceso. No se puede deshacer.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40"
            onClick={onClose}
            disabled={loading}
          >
            Volver
          </button>
          <button
            type="button"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-40"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Cancelando...' : 'Si, cancelar pedido'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}


