import '../styles/PredictionDisplay.css'

const PredictionDisplay = ({ prediction, confidence, isLoading, error }) => {
  if (error) {
    return (
      <div className="prediction-container error">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const getGestureEmoji = (gesture) => {
    const emojiMap = {
      'Rock': '✊',
      'Paper': '✋',
      'Scissor': '✌️',
    }
    return emojiMap[gesture] || '❓'
  }

  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'high'
    if (conf >= 0.6) return 'medium'
    return 'low'
  }

  return (
    <div className="prediction-container">
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing gesture...</p>
        </div>
      ) : prediction ? (
        <div className="prediction-content">
          <div className={`gesture-display ${getConfidenceColor(confidence)}`}>
            <div className="gesture-emoji">{getGestureEmoji(prediction)}</div>
            <h2 className="gesture-name">{prediction}</h2>
          </div>

          <div className="confidence-section">
            <div className="confidence-label">Confidence</div>
            <div className={`confidence-bar ${getConfidenceColor(confidence)}`}>
              <div
                className="confidence-fill"
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
            <div className="confidence-percentage">{Math.round(confidence * 100)}%</div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>Start the webcam to begin detection</p>
        </div>
      )}
    </div>
  )
}

export default PredictionDisplay
