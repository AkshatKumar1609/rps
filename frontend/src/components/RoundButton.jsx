/**
 * RoundButton — the main CTA that drives the game flow.
 * States: idle | countdown | loading | disabled
 */
export function RoundButton({ onClick, gameState, countdown }) {
  const isIdle = gameState === 'idle';
  const isCountdown = gameState === 'countdown';
  const isLoading = gameState === 'loading';
  const isDisabled = gameState === 'disabled';
  const disabled = isCountdown || isLoading || isDisabled;

  let label;
  let subLabel = null;

  if (isIdle) {
    label = 'Start Round';
  } else if (isCountdown) {
    label = countdown;
    subLabel = 'Hold your gesture…';
  } else if (isLoading) {
    label = null; // spinner
    subLabel = 'Analysing…';
  } else if (isDisabled) {
    label = 'Start Round';
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        id="start-round-btn"
        onClick={onClick}
        disabled={disabled}
        className={`
          relative w-48 h-14 rounded-xl font-semibold text-base tracking-wide
          transition-all duration-200 cursor-pointer
          ${isIdle
            ? 'bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-[1.02] shadow-lg shadow-black/30 active:scale-[0.98]'
            : isCountdown
              ? 'bg-zinc-800 border border-zinc-600 text-zinc-100'
              : isLoading
                ? 'bg-zinc-800 border border-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed opacity-60'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-zinc-300 animate-spin" />
          </span>
        ) : isCountdown ? (
          <span className="text-4xl font-bold tabular-nums">{countdown}</span>
        ) : (
          <span>{label}</span>
        )}
      </button>
      {subLabel && (
        <p className="text-xs text-zinc-500 font-medium animate-pulse">{subLabel}</p>
      )}
    </div>
  );
}
