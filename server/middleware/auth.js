/**
 * Authentication middleware
 * 
 * Validates JWT tokens from Supabase Auth.
 * In demo mode (no Grok API key), authentication is optional.
 */

/**
 * Extract and validate user from Authorization header
 * 
 * In production, this would verify the Supabase JWT.
 * For the MVP, we extract the user ID if present.
 */
function authenticateRequest(req) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No auth token — allow in demo mode
    return { userId: null, authenticated: false };
  }
  
  const token = authHeader.substring(7);
  
  // In production, verify the JWT with Supabase
  // For MVP, we do a simple decode (not secure — replace with proper verification)
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      return { userId: payload.sub, authenticated: true };
    }
  } catch (e) {
    // Invalid token
  }
  
  return { userId: null, authenticated: false };
}

module.exports = { authenticateRequest };
