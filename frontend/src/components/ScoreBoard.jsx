/**
 * ScoreBoard — top banner showing current session scores.
 */
export function ScoreBoard({ score, onReset }) {
  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight text-zinc-100">RPS</span>
          <span className="hidden sm:block text-xs text-zinc-500 font-medium uppercase tracking-widest">
            Gesture Arena
          </span>
        </div>

        {/* Score Tracker */}
        <div className="flex items-center gap-2 sm:gap-6">
          <ScorePill label="You" value={score.player} color="text-emerald-400" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">Ties</span>
            <span className="text-sm font-semibold text-zinc-400">{score.ties}</span>
          </div>
          <ScorePill label="CPU" value={score.computer} color="text-rose-400" />

          {/* Reset */}
          <button
            id="reset-score-btn"
            onClick={onReset}
            className="ml-2 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all duration-150 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}

function ScorePill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center min-w-[2.5rem]">
      <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">{label}</span>
      <span className={`text-xl font-bold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
