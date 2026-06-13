import { useCallback, useRef, useState } from 'react';
import { ScoreBoard } from './components/ScoreBoard';
import { WebcamFeed } from './components/WebcamFeed';
import { RoundButton } from './components/RoundButton';
import { ResultCard } from './components/ResultCard';
import { Toast } from './components/Toast';
import { useWebcam } from './hooks/useWebcam';
import { useScore } from './hooks/useScore';
import { predictMove } from './lib/api';
import { determineWinner, getComputerMove } from './lib/game';

// The bounding box position and size on the video element (CSS pixels)
const BOX_X = 0;
const BOX_Y = 0;
const BOX_SIZE = 224;

/**
 * Captures the bounding-box region from the live video and returns a Blob.
 * Accounts for the CSS mirror transform by flipping the source x coordinate.
 */
function captureBox(videoEl) {
  const canvas = document.createElement('canvas');
  canvas.width = BOX_SIZE;
  canvas.height = BOX_SIZE;
  const ctx = canvas.getContext('2d');

  // The video is CSS-mirrored (scale-x-[-1]). To capture what's visually in
  // the top-left box we read from the top-right of the raw video frame.
  const videoW = videoEl.videoWidth;
  const videoH = videoEl.videoHeight;
  const displayW = videoEl.clientWidth;
  const displayH = videoEl.clientHeight;
  const scaleX = videoW / displayW;
  const scaleY = videoH / displayH;

  // Source coordinates in the raw (un-mirrored) video frame
  const srcX = videoW - (BOX_X + BOX_SIZE) * scaleX; // mirror flip
  const srcY = BOX_Y * scaleY;
  const srcW = BOX_SIZE * scaleX;
  const srcH = BOX_SIZE * scaleY;

  ctx.drawImage(videoEl, srcX, srcY, srcW, srcH, 0, 0, BOX_SIZE, BOX_SIZE);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
}

export default function App() {
  const { videoRef, isReady, error: camError, startCamera, handleVideoReady } = useWebcam();
  const { score, addResult, resetScore } = useScore();

  const [gameState, setGameState] = useState('idle'); // idle | countdown | loading | result
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  // Keep a ref always in sync with gameState so callbacks never go stale
  const gameStateRef = useRef('idle');
  const setGame = useCallback((s) => {
    gameStateRef.current = s;
    setGameState(s);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleVideoReadyAndStart = useCallback(() => {
    handleVideoReady();
  }, [handleVideoReady]);

  // Kick off camera once
  const cameraStarted = useRef(false);
  const initCamera = useCallback(() => {
    if (!cameraStarted.current) {
      cameraStarted.current = true;
      startCamera();
    }
  }, [startCamera]);

  const handleStartRound = useCallback(async () => {
    // Read from ref — never stale regardless of when this closure was created
    if (gameStateRef.current !== 'idle' && gameStateRef.current !== 'result') return;

    setResult(null);
    setGame('countdown');
    setCountdown(3);

    // Countdown 3 → 2 → 1
    await new Promise((resolve) => {
      let count = 3;
      const tick = setInterval(() => {
        count -= 1;
        if (count === 0) {
          clearInterval(tick);
          resolve();
        } else {
          setCountdown(count);
        }
      }, 1000);
    });

    setGame('loading');

    let blob;
    try {
      blob = await captureBox(videoRef.current);
    } catch (err) {
      setToast('Failed to capture webcam frame. Please try again.');
      setGame('idle');
      return;
    }

    let prediction;
    try {
      prediction = await predictMove(blob);
    } catch (err) {
      setToast(err.message || 'Backend request failed. Is the server running?');
      setGame('idle');
      return;
    }

    const playerMove = prediction.prediction;
    const confidence = prediction.confidence;
    const computerMove = getComputerMove();
    const outcome = determineWinner(playerMove, computerMove);

    addResult(outcome);
    setResult({ playerMove, confidence, computerMove, outcome });
    setGame('result');
  }, [setGame, videoRef, addResult]); // gameState intentionally NOT a dep — using ref instead

  const handlePlayAgain = useCallback(() => {
    setResult(null);
    setGame('idle');
  }, [setGame]);

  const wrapperRef = useCallback(
    (node) => { if (node) initCamera(); },
    [initCamera],
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <ScoreBoard score={score} onReset={resetScore} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Game Arena</h1>
          <p className="text-sm text-zinc-500">
            Place your hand inside the green box, then press <strong className="text-zinc-400 font-medium">Start Round</strong>.
          </p>
        </div>

        {camError && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
            <p className="text-sm text-rose-400 font-medium">{camError}</p>
          </div>
        )}

        <div ref={wrapperRef}>
          <WebcamFeed
            videoRef={videoRef}
            isReady={isReady}
            onVideoReady={handleVideoReadyAndStart}
          />
        </div>

        <div className="flex justify-center mt-2">
          <RoundButton
            onClick={handleStartRound}
            gameState={gameState === 'result' ? 'idle' : gameState}
            countdown={countdown}
          />
        </div>

        {result && (
          <ResultCard result={result} onPlayAgain={handlePlayAgain} />
        )}

        {!result && gameState === 'idle' && isReady && (
          <div className="flex items-center justify-center gap-6 text-xs text-zinc-600 font-medium mt-2 select-none">
            <span>✊ Rock</span>
            <span className="text-zinc-700">·</span>
            <span>✋ Paper</span>
            <span className="text-zinc-700">·</span>
            <span>✌️ Scissors</span>
          </div>
        )}
      </main>

      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}
