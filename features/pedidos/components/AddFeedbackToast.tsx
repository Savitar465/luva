interface AddFeedbackToastProps {
  message: string;
}

export function AddFeedbackToast({ message }: AddFeedbackToastProps) {
  return (
    <div className="pos-toast-in mb-4 inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
      {message}
    </div>
  );
}

