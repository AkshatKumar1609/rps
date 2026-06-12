import { useState, useCallback, useEffect } from 'react'
import WebcamCapture from './components/WebcamCapture'
import PredictionDisplay from './components/PredictionDisplay'
import { sendImageToBackend, isBackendAvailable } from './services/api'
import './styles/App.css'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [backendAvailable, setBackendAvailable] = useState(true)

  // Check if backend is available on mount
  useEffect(() => {
    const checkBackend = async () => {
      const available = await isBackendAvailable()
      setBackendAvailable(available)
      if (!available) {
        setError('Backend API is not available. Make sure the FastAPI server is running on localhost:5000')
      }
    }
    checkBackend()
  }, [])

  const handleFrameCapture = useCallback(async (frameBlob) => {
    if (!backendAvailable || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await sendImageToBackend(frameBlob)
      setPrediction(result.prediction)
      setConfidence(result.confidence)
    } catch (err) {
      console.error('Prediction error:', err)
      if (err.response?.status === 422) {
        setError('Invalid image format. Please ensure your face is visible.')
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Backend may be slow or unavailable.')
      } else if (err.message === 'Network Error') {
        setError('Network error. Is the backend running on localhost:5000?')
      } else {
        setError('Failed to get prediction. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, backendAvailable])

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">✊✋✌️ Rock Paper Scissors</h1>
          <p className="app-subtitle">Hand Gesture Detector</p>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="app-error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="content-grid">
          <section className="section webcam-section">
            <h2 className="section-title">Live Camera</h2>
            <WebcamCapture onFrameCapture={handleFrameCapture} isLoading={isLoading} />
          </section>

          <section className="section prediction-section">
            <h2 className="section-title">Prediction Result</h2>
            <PredictionDisplay
              prediction={prediction}
              confidence={confidence}
              isLoading={isLoading}
              error={!backendAvailable ? 'Backend not available' : null}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Show your hand in front of the camera to detect Rock, Paper, or Scissors gestures</p>
        <p className="footer-note">Backend: {backendAvailable ? '✓ Connected' : '✗ Offline'}</p>
      </footer>
    </div>
  )
}

export default App
