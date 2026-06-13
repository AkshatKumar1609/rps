import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Manages a webcam stream lifecycle.
 * Returns { videoRef, isReady, error, startCamera, stopCamera }
 */
export function useWebcam() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    setError(null);
    setIsReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access and refresh.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a webcam and refresh.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  const handleVideoReady = useCallback(() => {
    setIsReady(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return { videoRef, isReady, error, startCamera, stopCamera, handleVideoReady };
}
