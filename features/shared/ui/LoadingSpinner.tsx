interface LoadingSpinnerProps {
  className?: string;
  label?: string;
  sizeClassName?: string;
}

export function LoadingSpinner({
  className = '',
  label,
  sizeClassName = 'h-12 w-12',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`.trim()}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClassName}`}></div>
      {label ? <span className="text-sm text-gray-500">{label}</span> : null}
    </div>
  );
}

