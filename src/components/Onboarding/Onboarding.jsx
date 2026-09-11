import { useEffect, useState } from 'react';
import NameInput from './NameInput';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { setUserName } from '../../lib/storage';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState('hi');
  const [hiVisible, setHiVisible] = useState(false);
  const [name, setName] = useState('');
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (step !== 'hi') return undefined;

    // Fade in, hold briefly, fade out — roughly 1.5s total.
    const fadeMs = reducedMotion ? 0 : 500;
    const holdMs = reducedMotion ? 300 : 500;

    const raf = requestAnimationFrame(() => setHiVisible(true));
    const fadeOutTimer = setTimeout(() => setHiVisible(false), fadeMs + holdMs);
    const nextStepTimer = setTimeout(() => setStep('name'), fadeMs + holdMs + fadeMs);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeOutTimer);
      clearTimeout(nextStepTimer);
    };
  }, [step, reducedMotion]);

  function handleNameSubmit(submittedName) {
    const trimmed = submittedName.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    setName(trimmed);
    setStep('welcome');
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-50 px-6">
      {step === 'hi' && (
        <h1
          className={`text-4xl font-medium text-neutral-900 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            hiVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Hi
        </h1>
      )}

      {step === 'name' && (
        <div className="flex w-full max-w-sm flex-col items-center gap-8 animate-fadeIn motion-reduce:animate-none">
          <h1 className="text-center text-2xl font-medium text-neutral-900">
            How may I address you?
          </h1>
          <NameInput onSubmit={handleNameSubmit} />
        </div>
      )}

      {step === 'welcome' && (
        <div className="flex w-full max-w-sm flex-col items-center gap-8 animate-fadeIn motion-reduce:animate-none">
          <h1 className="text-center text-2xl font-medium text-neutral-900">
            Let&rsquo;s start, {name}
          </h1>
          <button
            type="button"
            onClick={onComplete}
            className="animate-fadeIn rounded-full bg-neutral-900 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 motion-reduce:animate-none"
            style={{ animationDelay: reducedMotion ? '0ms' : '200ms' }}
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
}
