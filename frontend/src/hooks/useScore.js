import { useState, useCallback } from 'react';

/**
 * Manages score (player wins, computer wins, ties) with persistence.
 */
export function useScore() {
  const [score, setScore] = useState({ player: 0, computer: 0, ties: 0 });

  const addResult = useCallback((outcome) => {
    setScore((prev) => ({
      ...prev,
      player: outcome === 'win' ? prev.player + 1 : prev.player,
      computer: outcome === 'lose' ? prev.computer + 1 : prev.computer,
      ties: outcome === 'tie' ? prev.ties + 1 : prev.ties,
    }));
  }, []);

  const resetScore = useCallback(() => {
    setScore({ player: 0, computer: 0, ties: 0 });
  }, []);

  return { score, addResult, resetScore };
}
