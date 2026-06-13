import { useEffect } from 'react';

/**
 * Toast — a non-intrusive error notification that auto-dismisses.
 */
export function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      id="error-toast"
      role="alert"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-4 py-3 rounded-xl
        bg-zinc-900 border border-rose-500/30 shadow-2xl shadow-black/60
        max-w-sm w-[calc(100vw-2rem)]
        animate-in slide-in-from-bottom-4 duration-300"
    >
      <span className="shrink-0 w-2 h-2 rounded-full bg-rose-400" />
      <p className="text-sm text-zinc-300 font-medium flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="1" y1="1" x2="13" y2="13" />
          <line x1="13" y1="1" x2="1" y2="13" />
        </svg>
      </button>
    </div>
  );
}
