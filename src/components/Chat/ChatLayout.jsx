import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import Logo from '../common/Logo';
import Settings from '../Settings/Settings';
import {
  getConversations,
  saveConversations,
  getActiveConversationId,
  setActiveConversationId,
  getUserName,
} from '../../lib/storage';
import { generateId, titleFromMessage } from '../../lib/utils';
import { generateAIResponse } from '../../lib/ai';

export default function ChatLayout() {
  const [conversations, setConversations] = useState(() => getConversations());
  const [activeId, setActiveId] = useState(() => {
    const stored = getActiveConversationId();
    const initialConversations = getConversations();
    if (stored && initialConversations.some((c) => c.id === stored)) return stored;
    return initialConversations[0]?.id || null;
  });
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userName, setUserNameState] = useState(() => getUserName());

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    setActiveConversationId(activeId);
  }, [activeId]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  function handleNewChat() {
    const newConversation = {
      id: generateId(),
      title: '',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveId(newConversation.id);
    setSidebarOpen(false);
  }

  function handleSelectConversation(id) {
    setActiveId(id);
    setSidebarOpen(false);
  }

  function handleDeleteConversation(id) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }

  async function handleSend(text) {
    let convId = activeId;
    let workingConversations = conversations;

    if (!convId) {
      const newConversation = {
        id: generateId(),
        title: '',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      workingConversations = [newConversation, ...conversations];
      convId = newConversation.id;
      setActiveId(convId);
    }

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedConversations = workingConversations.map((c) => {
      if (c.id !== convId) return c;
      const isFirstMessage = c.messages.length === 0;
      return {
        ...c,
        title: isFirstMessage ? titleFromMessage(text) : c.title,
        messages: [...c.messages, userMessage],
        updatedAt: Date.now(),
      };
    });

    setConversations(updatedConversations);
    setIsTyping(true);

    const targetConversation = updatedConversations.find((c) => c.id === convId);
    const historyForAI = targetConversation.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const reply = await generateAIResponse(historyForAI);
      const aiMessage = {
        id: generateId(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, aiMessage], updatedAt: Date.now() }
            : c
        )
      );
    } finally {
      setIsTyping(false);
    }
  }

  function handleNameChange(newName) {
    setUserNameState(newName);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open conversation history"
              className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 md:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="md:hidden">
              <Logo size="sm" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" />
              <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </header>

        <ChatWindow messages={activeConversation?.messages || []} isTyping={isTyping} />
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>

      {settingsOpen && (
        <Settings
          currentName={userName}
          onClose={() => setSettingsOpen(false)}
          onNameChange={handleNameChange}
        />
      )}
    </div>
  );
}
