// Game constants
export const MOVES = ['Rock', 'Paper', 'Scissor'];

export const OUTCOMES = {
  win: 'win',
  lose: 'lose',
  tie: 'tie',
};

export const MOVE_EMOJI = {
  Rock: '✊',
  Paper: '✋',
  Scissor: '✌️',
};

/**
 * Returns the outcome from the player's perspective.
 * @param {string} player - 'Rock' | 'Paper' | 'Scissor'
 * @param {string} computer - 'Rock' | 'Paper' | 'Scissor'
 * @returns {'win' | 'lose' | 'tie'}
 */
export function determineWinner(player, computer) {
  if (player === computer) return OUTCOMES.tie;
  const winMap = {
    Rock: 'Scissor',
    Paper: 'Rock',
    Scissor: 'Paper',
  };
  return winMap[player] === computer ? OUTCOMES.win : OUTCOMES.lose;
}

/**
 * Returns a random computer move.
 */
export function getComputerMove() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}
