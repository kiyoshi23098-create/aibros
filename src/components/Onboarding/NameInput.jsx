import { useState } from 'react';

export default function NameInput({ onSubmit }) {
  const [value, setValue] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-5 animate-fadeIn motion-reduce:animate-none"
      style={{ animationDelay: '150ms' }}
    >
      <div className="w-full">
        <label htmlFor="name-input" className="sr-only">
          Your name
        </label>
        <input
          id="name-input"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Your name"
          autoFocus
          autoComplete="name"
          className="w-full border-b border-neutral-300 bg-transparent px-1 py-2 text-center text-lg text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-full bg-neutral-900 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      >
        Get Started
      </button>
    </form>
  );
}
