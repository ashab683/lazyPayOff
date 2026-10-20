const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Helper to make API requests with timeout and error extraction
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    const data = await res.json().catch(() => ({
      ok: false,
      error: `Server returned invalid JSON (HTTP ${res.status})`
    }));

    if (!res.ok) {
      const errorMsg = data.error || `HTTP error ${res.status}`;
      const err = new Error(errorMsg);
      err.code = data.code || 'API_ERROR';
      err.details = data.details || null;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const connErr = new Error('Cannot connect to backend server. Make sure server is running on port 3001.');
      connErr.code = 'SERVER_OFFLINE';
      throw connErr;
    }
    throw err;
  }
}

export async function fetchAiStatus() {
  return request('/api/ai/status');
}

export async function summarizeText(text) {
  return request('/api/ai/summarize', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

export async function organizeTasks(text) {
  return request('/api/ai/organize', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

export async function extractActions(text) {
  return request('/api/ai/extract-actions', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

export async function createChecklist(text) {
  return request('/api/ai/checklist', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

export async function simplifyText(text) {
  return request('/api/ai/simplify', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}
