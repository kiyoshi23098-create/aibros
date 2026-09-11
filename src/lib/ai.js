const MOCK_RESPONSES = [
  "That's an interesting question. Here's a simple way to think about it: break it into smaller parts and tackle each one on its own.",
  "I can help with that. Let's go through it step by step once you give me a bit more detail.",
  "Good point — here's what I'd consider first before deciding anything.",
  "Here's a concise take. Let me know if you'd like me to go deeper on any part of it.",
  "I don't have a live AI connection configured yet, but here's a placeholder response so you can test the interface end to end.",
];

function pickMockResponse(userText) {
  const lower = userText.toLowerCase();

  if (lower.includes('hello') || lower.startsWith('hi')) {
    return "Hello! I'm AiBros. I'm currently running in mock mode — connect a real AI backend to get live answers.";
  }

  if (lower.includes('who are you') || lower.includes('what are you')) {
    return "I'm AiBros — a minimal, focused AI chat interface. Right now no AI backend is connected, so I'm replying with placeholder text.";
  }

  const index = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[index];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates an AI reply for the given conversation history.
 *
 * `messages` is an array of { role: 'user' | 'assistant', content: string }.
 *
 * In production this calls a secure backend endpoint (a Netlify Function or
 * a Vercel/Node API route) that holds the real provider API key server-side.
 * The frontend never sees or sends the key. If that endpoint isn't reachable
 * (e.g. local development with no backend wired up yet), it falls back to a
 * short mock reply so the interface stays fully usable.
 */
export async function generateAIResponse(messages) {
  const endpoint = import.meta.env.VITE_AI_API_ENDPOINT || '/api/chat';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data.reply !== 'string') {
      throw new Error('Malformed backend response');
    }

    return data.reply;
  } catch {
    // No backend configured, or it failed — fall back to a mock reply so
    // the UI keeps working during development.
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    await wait(500 + Math.random() * 500);
    return pickMockResponse(lastUserMessage ? lastUserMessage.content : '');
  }
}
