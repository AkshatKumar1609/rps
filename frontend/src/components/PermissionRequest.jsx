import '../styles/PermissionRequest.css'

const PermissionRequest = ({ onRequestPermission, error, onRetry }) => {
  return (
    <div className="permission-container">
      <div className="permission-card">
        <div className="permission-icon">🎥</div>
        <h2>Webcam Permission Required</h2>

        {error ? (
          <>
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={onRetry}>
              Try Again
            </button>
          </>
        ) : (
          <>
            <p>This application needs access to your webcam to detect hand gestures.</p>
            <div className="permission-info">
              <div className="info-item">
                <span className="info-icon">✓</span>
                <span>Your camera feed is processed only on your device</span>
              </div>
              <div className="info-item">
                <span className="info-icon">✓</span>
                <span>No data is stored or saved</span>
              </div>
              <div className="info-item">
                <span className="info-icon">✓</span>
                <span>You can revoke access at any time in your browser settings</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={onRequestPermission}>
              Allow Webcam Access
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PermissionRequest
