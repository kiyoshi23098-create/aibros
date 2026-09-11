import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export default function WelcomeScreen({ name, onComplete }) {
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const fadeMs = reducedMotion ? 0 : 500;
    const holdMs = reducedMotion ? 300 : 500;

    const raf = requestAnimationFrame(() => setVisible(true));
    const fadeOutTimer = setTimeout(() => setVisible(false), fadeMs + holdMs);
    const completeTimer = setTimeout(() => onComplete(), fadeMs + holdMs + fadeMs);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [reducedMotion, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-50 px-6">
      <h1
        className={`text-3xl font-medium text-neutral-900 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Welcome back, {name}
      </h1>
    </div>
  );
}
