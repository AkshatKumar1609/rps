import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Custom hook to manage webcam stream
 * @returns {Object} {videoRef, isStreamActive, permissionGranted, error, startStream, stopStream, captureFrame}
 */
export const useWebcam = () => {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [isStreamActive, setIsStreamActive] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [error, setError] = useState(null)

  const startStream = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      })

      console.log('Stream obtained:', stream)
      console.log('Video ref:', videoRef.current)
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        console.log('Stream set to video element')
        
        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, attempting to play')
          videoRef.current.play().catch(err => console.error('Play error:', err))
        }
      }
      setPermissionGranted(true)
      setIsStreamActive(true)
    } catch (err) {
      console.error('Error accessing webcam:', err)
      if (err.name === 'NotAllowedError') {
        setError('Webcam permission denied. Please allow access to continue.')
      } else if (err.name === 'NotFoundError') {
        setError('No webcam found on this device.')
      } else {
        setError(`Error accessing webcam: ${err.message}`)
      }
      setPermissionGranted(false)
    }
  }, [])

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsStreamActive(false)
  }, [])

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isStreamActive) return null

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0)

    return canvas.toBlob((blob) => blob, 'image/jpeg', 0.8)
  }, [isStreamActive])

  const captureFrameSync = useCallback(() => {
    if (!videoRef.current || !isStreamActive) return null

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.8)
    })
  }, [isStreamActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])

  return {
    videoRef,
    isStreamActive,
    permissionGranted,
    error,
    startStream,
    stopStream,
    captureFrame: captureFrameSync,
  }
}
