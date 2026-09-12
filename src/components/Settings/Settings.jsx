import { useState } from 'react';
import { setUserName, clearUserName } from '../../lib/storage';
import { getStoredTheme, setTheme as applyStoredTheme } from '../../lib/theme';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export default function Settings({ currentName, onClose, onNameChange }) {
  const [name, setName] = useState(currentName || '');
  const [theme, setThemeState] = useState(() => getStoredTheme());

  function handleSave(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    onNameChange(trimmed);
    onClose();
  }

  function handleThemeChange(value) {
    setThemeState(value);
    applyStoredTheme(value);
  }

  function handleResetOnboarding() {
    clearUserName();
    window.location.reload();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="settings-title" className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus-visible:outline-neutral-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label htmlFor="settings-name" className="mb-1.5 block text-sm text-neutral-600 dark:text-neutral-400">
              Your name
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-100"
              autoFocus
            />
          </div>

          <div>
            <p className="mb-1.5 block text-sm text-neutral-600 dark:text-neutral-400">Appearance</p>
            <div className="flex gap-1.5">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleThemeChange(option.value)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 ${
                    theme === option.value
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:outline-neutral-100"
          >
            Save
          </button>
        </form>

        <button
          type="button"
          onClick={handleResetOnboarding}
          className="mt-4 text-xs text-neutral-400 underline-offset-2 hover:text-neutral-600 hover:underline dark:text-neutral-600 dark:hover:text-neutral-300"
        >
          Reset onboarding on this device
        </button>
      </div>
    </div>
  );
      }
