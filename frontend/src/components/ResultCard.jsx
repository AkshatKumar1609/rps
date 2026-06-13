import { MOVE_EMOJI } from '../lib/game';

const OUTCOME_CONFIG = {
  win: {
    label: 'You Won!',
    labelClass: 'text-emerald-400',
    bg: 'border-emerald-500/20 bg-emerald-500/5',
  },
  lose: {
    label: 'Computer Won!',
    labelClass: 'text-rose-400',
    bg: 'border-rose-500/20 bg-rose-500/5',
  },
  tie: {
    label: "It's a Tie!",
    labelClass: 'text-amber-400',
    bg: 'border-amber-500/20 bg-amber-500/5',
  },
};

/**
 * ResultCard — displayed after each round with detection details.
 */
export function ResultCard({ result, onPlayAgain }) {
  const config = OUTCOME_CONFIG[result.outcome];

  return (
    <div
      id="result-card"
      className={`
        w-full max-w-2xl mx-auto mt-4 rounded-xl border p-5
        transition-all duration-300 animate-in
        ${config.bg}
      `}
      style={{ animationDuration: '0.35s' }}
    >
      {/* Outcome headline */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${config.labelClass}`}>{config.label}</h2>
        <button
          id="play-again-btn"
          onClick={onPlayAgain}
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-all duration-150 cursor-pointer"
        >
          Play Again
        </button>
      </div>

      {/* Moves */}
      <div className="grid grid-cols-2 gap-3">
        <MoveCard
          title="You"
          move={result.playerMove}
          sub={`Detected: ${result.playerMove} (${result.confidence}%)`}
          accent="emerald"
        />
        <MoveCard
          title="Computer"
          move={result.computerMove}
          sub="Random choice"
          accent="rose"
        />
      </div>
    </div>
  );
}

function MoveCard({ title, move, sub, accent }) {
  const accentClass = {
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    rose: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
  }[accent];

  return (
    <div className={`flex flex-col items-center gap-1 py-4 rounded-lg border ${accentClass}`}>
      <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-500">{title}</span>
      <span className="text-4xl">{MOVE_EMOJI[move]}</span>
      <span className="text-sm font-semibold text-zinc-200">{move}</span>
      <span className="text-[10px] text-zinc-500 text-center px-2">{sub}</span>
    </div>
  );
}
