import { useState } from 'react';
import { formatTime } from '../../lib/utils';

export default function Message({ role, content, image, timestamp, isLast, onRegenerate, regenerating }) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable in this context — not critical, fail silently.
    }
  }

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[85%] flex-col gap-1 sm:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {image && (
          <img
            src={image.previewUrl}
            alt="Attached"
            className="max-h-64 rounded-2xl object-cover"
          />
        )}
        {content && (
          <div
            className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
              isUser
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100'
            }`}
          >
            {content}
          </div>
        )}

        <div className="flex items-center gap-3 px-1">
          {timestamp && (
            <span className="text-xs text-neutral-400 dark:text-neutral-600">{formatTime(timestamp)}</span>
          )}
          {content && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-600 dark:hover:text-neutral-300 dark:focus-visible:outline-neutral-100"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
          {!isUser && isLast && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="text-xs text-neutral-400 transition-colors hover:text-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-600 dark:hover:text-neutral-300 dark:focus-visible:outline-neutral-100"
            >
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
