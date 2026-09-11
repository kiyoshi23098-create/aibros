const NAME_KEY = 'aibros_user_name';
const CONV_KEY = 'aibros_conversations';
const ACTIVE_KEY = 'aibros_active_conversation';

export function getUserName() {
  return localStorage.getItem(NAME_KEY) || '';
}

export function setUserName(name) {
  localStorage.setItem(NAME_KEY, name.trim());
}

export function clearUserName() {
  localStorage.removeItem(NAME_KEY);
}

export function getConversations() {
  try {
    const raw = localStorage.getItem(CONV_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations) {
  try {
    localStorage.setItem(CONV_KEY, JSON.stringify(conversations));
  } catch {
    // localStorage may be full or unavailable — fail silently, chat still
    // works in-memory for the current session.
  }
}

export function getActiveConversationId() {
  return localStorage.getItem(ACTIVE_KEY) || null;
}

export function setActiveConversationId(id) {
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
}
