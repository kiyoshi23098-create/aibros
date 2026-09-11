// Example Netlify serverless function for connecting a real AI provider.
//
// The frontend calls POST /api/chat (redirected to this function — see
// netlify.toml). The API key lives only in this server-side environment
// variable and is never sent to or exposed in the browser.
//
// Set ANTHROPIC_API_KEY in your Netlify site's environment variables
// (Site settings -> Environment variables) before deploying.

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body || '{}');

    if (!Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'A "messages" array is required.' }),
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }),
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errorText }) };
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
