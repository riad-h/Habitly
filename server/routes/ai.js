/**
 * AI Route Handler — Grok API integration
 * 
 * Calls the Grok API to generate habit suggestions based on user goals.
 * The API key is loaded from environment variables and never exposed to the client.
 */

const https = require('https');

const GROK_API_KEY = process.env.GROK_API_KEY || '';
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

/**
 * System prompt for the Grok API
 * Instructs the model to generate safe, actionable habit suggestions
 */
const SYSTEM_PROMPT = `You are a helpful habit suggestion assistant. Your job is to suggest small, realistic, actionable daily habits based on what the user wants to improve.

Rules:
- Generate 3-5 habit suggestions
- Each habit should be small and achievable
- Avoid unrealistic or extreme goals
- Never provide medical advice
- Never suggest anything dangerous or harmful
- Keep descriptions concise (under 100 characters)
- Keep habit names short (under 50 characters)
- Focus on positive, constructive habits
- Return ONLY valid JSON in this exact format:

{
  "habits": [
    {
      "name": "Habit Name",
      "description": "Short description of the habit.",
      "frequency": "daily"
    }
  ]
}

Do not include any text outside the JSON. Do not explain your suggestions.`;

/**
 * Make HTTPS request to Grok API
 */
function callGrokAPI(messages) {
  return new Promise((resolve, reject) => {
    if (!GROK_API_KEY) {
      reject(new Error('GROK_API_KEY not configured'));
      return;
    }

    const postData = JSON.stringify({
      model: 'grok-2-latest',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const url = new URL(GROK_API_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error('Grok API error:', res.statusCode, data.substring(0, 200));
          reject(new Error(`Grok API returned status ${res.statusCode}`));
          return;
        }
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content;
          
          if (!content) {
            reject(new Error('No content in Grok API response'));
            return;
          }
          
          // Try to extract JSON from the response
          let jsonStr = content;
          
          // Sometimes the model wraps JSON in markdown code blocks
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            jsonStr = jsonMatch[1].trim();
          }
          
          const result = JSON.parse(jsonStr);
          resolve(result);
        } catch (e) {
          console.error('Failed to parse Grok response:', e.message);
          reject(new Error('Failed to parse AI response'));
        }
      });
    });

    req.on('error', (e) => {
      console.error('Grok API request error:', e.message);
      reject(new Error('Failed to connect to AI service'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Validate the AI response structure
 */
function validateAIResponse(data) {
  if (!data || !Array.isArray(data.habits)) {
    return false;
  }
  
  if (data.habits.length === 0 || data.habits.length > 10) {
    return false;
  }
  
  for (const habit of data.habits) {
    if (!habit.name || typeof habit.name !== 'string' || habit.name.length > 100) {
      return false;
    }
    if (!habit.description || typeof habit.description !== 'string') {
      return false;
    }
    if (!['daily', 'custom', 'weekly'].includes(habit.frequency)) {
      habit.frequency = 'daily'; // Default to daily if invalid
    }
  }
  
  return true;
}

/**
 * Handle AI habit generation request
 */
async function handleAIRequest(goal) {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `I want to: ${goal.trim()}` },
    ];
    
    const result = await callGrokAPI(messages);
    
    // Validate the response
    if (!validateAIResponse(result)) {
      console.error('Invalid AI response structure:', JSON.stringify(result).substring(0, 200));
      return { 
        error: 'AI returned invalid data', 
        data: { 
          habits: [
            { name: 'Morning Walk', description: 'Take a 15-minute walk in the morning.', frequency: 'daily' },
            { name: 'Read', description: 'Read for 10 minutes before bed.', frequency: 'daily' },
          ] 
        } 
      };
    }
    
    return { data: result, error: null };
    
  } catch (err) {
    console.error('AI request failed:', err.message);
    
    // Return fallback suggestions if API fails
    return {
      error: err.message,
      data: {
        habits: [
          { name: 'Morning Walk', description: 'Take a 15-minute walk after waking up.', frequency: 'daily' },
          { name: 'Drink Water', description: 'Drink a full glass of water first thing.', frequency: 'daily' },
          { name: 'Read', description: 'Read for at least 10 minutes.', frequency: 'daily' },
        ]
      }
    };
  }
}

module.exports = { handleAIRequest };
