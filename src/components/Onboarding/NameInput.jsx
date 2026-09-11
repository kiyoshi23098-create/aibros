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
      className="w-full animate-fadeIn motion-reduce:animate-none"
      style={{ animationDelay: '150ms' }}
    >
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
    </form>
  );
}
