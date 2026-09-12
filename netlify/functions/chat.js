export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages, userName } = JSON.parse(event.body || '{}');

    if (!Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'A "messages" array is required.' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }),
      };
    }

    const contents = messages.map((m) => {
      const parts = [];

      if (m.image && m.image.data && m.image.mimeType) {
        parts.push({ inlineData: { mimeType: m.image.mimeType, data: m.image.data } });
      }

      if (m.content) {
        parts.push({ text: m.content });
      }

      if (parts.length === 0) {
        parts.push({ text: '' });
      }

      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });

    const safeName = typeof userName === 'string' ? userName.trim().slice(0, 60) : '';

    const systemInstruction = safeName
      ? {
          parts: [
            {
              text: `The user's name is ${safeName}. Address them by name naturally where it fits, without overdoing it or repeating it in every single sentence.`,
            },
          ],
        }
      : undefined;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(systemInstruction ? { systemInstruction } : {}),
          contents,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini error body:', errorText);
      return { statusCode: response.status, body: JSON.stringify({ error: errorText }) };
    }

    const data = await response.json();
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
