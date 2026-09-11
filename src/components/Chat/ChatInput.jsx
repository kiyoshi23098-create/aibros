import { useRef, useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  function handleChange(event) {
    setValue(event.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-neutral-200 bg-white px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 transition-colors focus-within:border-neutral-400">
        <label htmlFor="chat-input" className="sr-only">
          Message AiBros
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message AiBros"
          className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-opacity disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 12L20 4L14 20L11 13L4 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-neutral-400">
        AiBros can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}
