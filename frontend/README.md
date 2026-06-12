# Rock Paper Scissors Hand Gesture Detector - Frontend

A modern React-based web application that detects Rock, Paper, and Scissors hand gestures in real-time using your webcam and a trained neural network model running on the backend.

## Features

✨ **Real-Time Detection**
- Live webcam feed with hand gesture recognition
- Real-time predictions with confidence scores
- Responsive UI with smooth animations

🎯 **User-Friendly Design**
- Clean, minimal interface
- Intuitive permission handling
- Mobile-responsive layout
- Color-coded confidence indicators (high/medium/low)

🔐 **Privacy-First**
- All video processing happens locally in your browser
- No data is stored or saved to the server
- You can revoke webcam access at any time

## Prerequisites

Before running the frontend, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **FastAPI Backend** running on `http://localhost:5000`

## Installation

1. **Clone or navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This installs React, Vite, Axios, and other required packages.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

This will:
- Start a local server on `http://localhost:3000`
- Automatically open the application in your browser
- Enable hot module reloading for instant updates

### Production Build

Create an optimized build:

```bash
npm run build
```

This generates a `dist/` folder with production-ready files.

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/
│   └── index.html           # HTML entry point
├── src/
│   ├── components/
│   │   ├── WebcamCapture.jsx       # Live webcam component
│   │   ├── PredictionDisplay.jsx   # Prediction result display
│   │   └── PermissionRequest.jsx   # Permission prompt component
│   ├── hooks/
│   │   └── useWebcam.js            # Custom hook for webcam stream management
│   ├── services/
│   │   └── api.js                  # API communication with backend
│   ├── styles/
│   │   ├── App.css                 # Main application styles
│   │   ├── WebcamCapture.css       # Webcam component styles
│   │   ├── PredictionDisplay.css   # Prediction display styles
│   │   └── PermissionRequest.css   # Permission request styles
│   ├── App.jsx                     # Main application component
│   └── main.jsx                    # React entry point
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
└── .gitignore                      # Git ignore rules
```

## How to Use

1. **Start the FastAPI Backend:**
   ```bash
   cd backend
   python main.py
   ```
   The backend should be running on `http://localhost:5000`

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will open on `http://localhost:3000`

3. **Allow Webcam Access:**
   - When you first visit the application, your browser will ask for webcam permission
   - Click "Allow" to grant access

4. **Start Detection:**
   - Click "Start Webcam" button
   - Position your hand in front of the camera
   - The application will capture frames every 500ms and send them to the backend
   - Predictions will appear on the right side with confidence scores

5. **Interpret Results:**
   - 🤚 **Rock**: Closed fist
   - ✋ **Paper**: Open hand with fingers extended
   - ✌️ **Scissors**: Two fingers extended

## Configuration

### Backend URL

The frontend is configured to communicate with the backend at `http://localhost:5000`. To change this:

1. Open [src/services/api.js](src/services/api.js)
2. Modify the `API_BASE_URL` constant:
   ```javascript
   const API_BASE_URL = 'http://your-backend-url:port'
   ```

### Frame Capture Interval

By default, frames are captured every 500ms. To change this:

1. Open [src/components/WebcamCapture.jsx](src/components/WebcamCapture.jsx)
2. Modify the interval in the `setInterval` call (line ~30):
   ```javascript
   }, 500)  // Change 500 to your desired milliseconds
   ```

## API Integration

The frontend communicates with the backend via the `/predict` endpoint:

**Endpoint:** `POST /predict`

**Request:**
```
Content-Type: multipart/form-data
Body: {
  "file": <image.jpg>
}
```

**Response:**
```json
{
  "prediction": "Rock|Paper|Scissor",
  "confidence": 0.95
}
```

## Troubleshooting

### "Backend API is not available"
- Ensure the FastAPI backend is running on `http://localhost:5000`
- Check that CORS is properly configured in the backend
- Verify no firewall is blocking the connection

### Webcam Permission Denied
- Check your browser's privacy settings
- Go to site settings and enable camera access for this page
- Refresh the page and try again

### No Predictions Appearing
- Check browser console (F12) for errors
- Verify the backend is responding to requests
- Ensure your hand is clearly visible in the camera

### Slow Predictions
- Check your internet connection (if backend is remote)
- Reduce the frame capture interval in WebcamCapture.jsx
- Ensure backend is not overloaded

## Browser Compatibility

- ✅ Chrome/Edge (Chromium-based) - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support (iOS 14+)
- ⚠️ Mobile browsers - Works but requires HTTPS for secure context (camera access)

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API requests
- **CSS3** - Styling with animations and gradients

## License

This project is part of the Rock Paper Scissors ML demo.

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console for error messages
3. Verify backend is running and accessible
4. Check that all dependencies are correctly installed

---

**Happy Gesture Detecting! 🎮**
