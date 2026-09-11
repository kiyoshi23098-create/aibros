export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body || '{}');
    console.log('Received messages:', JSON.stringify(messages));

    if (!Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'A "messages" array is required.' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API key present:', Boolean(apiKey));

    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }),
      };
    }

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    console.log('Gemini response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini error body:', errorText);
      return { statusCode: response.status, body: JSON.stringify({ error: errorText }) };
    }

    const data = await response.json();
    console.log('Gemini success response:', JSON.stringify(data));

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('Function crashed:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
