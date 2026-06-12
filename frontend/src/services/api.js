import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

/**
 * Send an image frame to the backend for prediction
 * @param {Blob} imageBlob - The image blob from canvas
 * @returns {Promise<{prediction: string, confidence: number}>}
 */
export const sendImageToBackend = async (imageBlob) => {
  try {
    const formData = new FormData()
    formData.append('file', imageBlob, 'frame.jpg')

    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 5000, // 5 second timeout
    })

    return {
      prediction: response.data.prediction,
      confidence: Math.round(response.data.confidence * 100) / 100, // Round to 2 decimals
    }
  } catch (error) {
    console.error('Error sending image to backend:', error)
    throw error
  }
}

/**
 * Check if backend is available
 * @returns {Promise<boolean>}
 */
export const isBackendAvailable = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/docs`, {
      timeout: 2000,
    })
    return true
  } catch (error) {
    return false
  }
}
