/**
 * Habitly — Backend Server
 * 
 * Pure Node.js server using built-in `http` module.
 * No Express or other frameworks.
 * 
 * This server handles:
 * - AI habit generation (proxy to Grok API)
 * - Rate limiting for AI requests
 * 
 * The Grok API key is kept server-side and never exposed to the frontend.
 */

const http = require('http');
const { handleAIRequest } = require('./routes/ai');
const { authenticateRequest } = require('./middleware/auth');

const PORT = process.env.PORT || 5000;

// Simple in-memory rate limiting store
const rateLimitStore = new Map();

// Clean up old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > 24 * 60 * 60 * 1000) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

/**
 * Parse request body as JSON
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Limit body size to 1MB
      if (body.length > 1e6) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

/**
 * Check rate limit for a user
 * Returns { allowed: boolean, remaining: number }
 */
function checkRateLimit(userId) {
  const now = Date.now();
  const key = userId || 'anonymous';
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 24 * 60 * 60 * 1000 });
    return { allowed: true, remaining: 9 };
  }
  
  if (entry.count >= 10) {
    return { allowed: false, remaining: 0 };
  }
  
  entry.count++;
  return { allowed: true, remaining: 10 - entry.count };
}

/**
 * Main request handler
 */
async function handleRequest(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  // Health check
  if (req.url === '/api/health' && req.method === 'GET') {
    sendJSON(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    return;
  }

  // AI habit generation endpoint
  if (req.url === '/api/ai/habits' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      
      // Validate request
      if (!body.goal || typeof body.goal !== 'string') {
        sendJSON(res, 400, { error: 'A "goal" string is required' });
        return;
      }
      
      if (body.goal.trim().length === 0) {
        sendJSON(res, 400, { error: 'Goal cannot be empty' });
        return;
      }
      
      if (body.goal.length > 500) {
        sendJSON(res, 400, { error: 'Goal must be 500 characters or less' });
        return;
      }
      
      // Authenticate (optional for demo, required in production)
      const authResult = authenticateRequest(req);
      const userId = authResult.userId;
      
      // Check rate limit
      const rateLimit = checkRateLimit(userId);
      if (!rateLimit.allowed) {
        sendJSON(res, 429, { 
          error: 'Rate limit exceeded. Maximum 10 AI generations per day.' 
        });
        return;
      }
      
      // Handle AI request
      const result = await handleAIRequest(body.goal);
      
      if (result.error) {
        console.error('AI generation error:', result.error);
        sendJSON(res, 500, { error: 'Failed to generate habits. Please try again.' });
        return;
      }
      
      sendJSON(res, 200, result.data);
      
    } catch (err) {
      console.error('Request error:', err.message);
      if (err.message === 'Invalid JSON') {
        sendJSON(res, 400, { error: 'Invalid JSON in request body' });
      } else if (err.message === 'Request body too large') {
        sendJSON(res, 413, { error: 'Request body too large' });
      } else {
        sendJSON(res, 500, { error: 'Internal server error' });
      }
    }
    return;
  }

  // 404 for unknown routes
  sendJSON(res, 404, { error: 'Not found' });
}

// Create and start server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Habitly server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`AI endpoint: POST http://localhost:${PORT}/api/ai/habits`);
});

module.exports = { server, checkRateLimit };
