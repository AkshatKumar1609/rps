import { useEffect } from 'react'
import { useWebcam } from '../hooks/useWebcam'
import PermissionRequest from './PermissionRequest'
import '../styles/WebcamCapture.css'

const WebcamCapture = ({ onFrameCapture, isLoading }) => {
  const { videoRef, isStreamActive, permissionGranted, error, startStream, stopStream } = useWebcam()

  // Auto-start stream when permission is granted
  useEffect(() => {
    if (permissionGranted && !isStreamActive && !error) {
      console.log('Permission granted, auto-starting stream')
      startStream()
    }
  }, [permissionGranted, isStreamActive, error, startStream])

  // Manual prediction trigger
  const handlePredictClick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Sending frame for prediction...')
          onFrameCapture(blob)
        }
      }, 'image/jpeg', 0.8)
    } else {
      alert('Webcam is not ready. Please wait a moment and try again.')
    }
  }

  if (error) {
    return <PermissionRequest error={error} onRetry={startStream} />
  }

  if (!permissionGranted) {
    return <PermissionRequest onRequestPermission={startStream} />
  }

  return (
    <div className="webcam-container">
      <div className="webcam-wrapper">
        <video
          ref={videoRef}
          className="webcam-video"
          autoPlay={true}
          playsInline={true}
          muted={true}
        />
        {isLoading && <div className="webcam-loading-overlay">Processing...</div>}
      </div>
      <div className="webcam-controls">
        <div className="controls-row">
          {!isStreamActive ? (
            <button className="btn btn-primary" onClick={startStream}>
              Start Webcam
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={stopStream}>
              Stop Webcam
            </button>
          )}
        </div>
        {isStreamActive && (
          <div className="controls-row">
            <button 
              className="btn btn-primary" 
              onClick={handlePredictClick}
              disabled={isLoading}
            >
              {isLoading ? 'Predicting...' : '🎯 Predict'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WebcamCapture
