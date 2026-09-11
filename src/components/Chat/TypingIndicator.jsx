export default function TypingIndicator() {
  return (
    <div className="flex justify-start" role="status" aria-label="AiBros is typing">
      <div className="flex items-center gap-1 rounded-2xl bg-neutral-100 px-4 py-3">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
