import { useRef, useEffect } from 'react';

// The bounding box size sent to the model
const BOX_SIZE = 224;

/**
 * WebcamFeed — renders the live video with an overlaid bounding box in the top-left.
 * Exposes videoRef and canvasRef to the parent for frame capture.
 */
export function WebcamFeed({ videoRef, isReady, onVideoReady }) {

  return (
    <div className="relative w-full aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/60">

      {/* Live video (mirrored) */}
      <video
        ref={videoRef}
        id="webcam-video"
        autoPlay
        playsInline
        muted
        onCanPlay={onVideoReady}
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {/* Overlay shown before camera is ready */}
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-600 border-t-zinc-300 animate-spin" />
          <p className="text-sm text-zinc-500 font-medium">Initialising camera…</p>
        </div>
      )}

      {/* Bounding box — top-left, 224×224 logical pixels, scaled with the video */}
      {isReady && (
        <BoundingBox size={BOX_SIZE} />
      )}
    </div>
  );
}

/**
 * Positions a styled bounding box in the top-left corner of the video.
 * The box is 224×224 CSS pixels — matching the model's input size exactly.
 */
function BoundingBox({ size }) {
  return (
    <div
      id="bounding-box"
      style={{ width: size, height: size, top: 0, left: 0 }}
      className="absolute pointer-events-none"
    >
      {/* Corner accents instead of a full border for a cleaner look */}
      {/* Top-left */}
      <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400/80 rounded-tl" />
      {/* Top-right */}
      <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400/80 rounded-tr" />
      {/* Bottom-left */}
      <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400/80 rounded-bl" />
      {/* Bottom-right */}
      <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400/80 rounded-br" />

      {/* Subtle inner fill */}
      <div className="absolute inset-0 bg-emerald-400/[0.03] border border-emerald-400/20 rounded-sm" />

      {/* Label */}
      <span className="absolute -bottom-6 left-0 text-[10px] font-medium text-emerald-400/70 uppercase tracking-widest whitespace-nowrap">
        Active Zone · {size}×{size}px
      </span>
    </div>
  );
}
