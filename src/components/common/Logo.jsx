export default function Logo({ size = 'md' }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  return (
    <div
      className={`flex items-center gap-1.5 font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 ${sizeClasses[size]}`}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-neutral-900 dark:bg-neutral-50" aria-hidden="true" />
      <span>AiBros</span>
    </div>
  );
}
