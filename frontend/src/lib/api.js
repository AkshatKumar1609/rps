const API_BASE = '';

/**
 * Sends a cropped image blob to the /predict endpoint.
 * @param {Blob} blob
 * @returns {Promise<{ prediction: string, confidence: number }>}
 */
export async function predictMove(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'capture.jpg');

  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Prediction failed (${response.status}): ${text}`);
  }

  return response.json();
}
