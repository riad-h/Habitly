/**
 * API client for communicating with the backend server
 * Used for AI habit generation (Grok API proxy)
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Request AI-generated habit suggestions
 */
export async function generateHabitsWithAI(goal, authToken) {
  try {
    const response = await fetch(`${API_BASE}/ai/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ goal }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to generate habits');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error' };
  }
}
