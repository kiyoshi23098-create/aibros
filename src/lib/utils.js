export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function titleFromMessage(text) {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= 42) return trimmed;
  return `${trimmed.slice(0, 42).trimEnd()}…`;
}

export function formatTime(timestamp) {
  try {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}
