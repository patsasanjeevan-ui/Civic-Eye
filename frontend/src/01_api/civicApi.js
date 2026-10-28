/**
 * CivicEye API Client
 * Connects to the Express backend handling multimodal inference, PostGIS spatial queries, and health checks
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Check backend and Ollama health status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    return {
      status: 'OFFLINE',
      error: error.message,
      ollama: { isOnline: false, message: 'Backend unreachable' },
      database: { isPostgresConnected: false, storageType: 'Disconnected' }
    };
  }
}

/**
 * Fetch all registered municipal grievances for the spatial heatmap
 */
export async function fetchGrievances() {
  try {
    const res = await fetch(`${API_BASE}/api/grievances`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.grievances || [];
  } catch (error) {
    console.error('Failed to fetch grievances:', error);
    return [];
  }
}

/**
 * Submit multimodal dual-image grievance for Gemma 4 analysis
 */
export async function submitGrievanceAnalysis({
  sitePhotoBase64,
  noticePhotoBase64,
  citizenNote,
  latitude,
  longitude,
  ward,
  selectedModel
}) {
  const payload = {
    sitePhotoBase64: sitePhotoBase64 || null,
    noticePhotoBase64: noticePhotoBase64 || null,
    citizenNote: citizenNote || '',
    latitude: Number(latitude) || 17.5150,
    longitude: Number(longitude) || 78.8910,
    ward: ward || 'Ward 12 (Bhongiri Zone)',
    selectedModel: selectedModel || 'gemma4:e4b'
  };

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    let errorMsg = `Analysis request failed with HTTP ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData && errorData.error) {
        errorMsg = errorData.error;
      }
    } catch {
      const text = await res.text().catch(() => '');
      if (text) {
        errorMsg = text.slice(0, 200);
      }
    }
    throw new Error(errorMsg);
  }

  return await res.json();
}

/**
 * Fetch municipal legal tools definitions
 */
export async function fetchMunicipalTools() {
  try {
    const res = await fetch(`${API_BASE}/api/tools`);
    if (!res.ok) throw new Error('Failed to fetch legal tools');
    return await res.json();
  } catch (error) {
    console.warn('Could not load tool catalog:', error.message);
    return null;
  }
}
