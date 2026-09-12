import { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const SUGGESTIONS = [
  'Help me write a short email',
  'Explain a concept simply',
  'Brainstorm ideas for a project',
  'Summarize a piece of text',
];

export default function ChatWindow({ messages, isTyping, onRegenerate, onSuggestionClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <p className="text-lg text-neutral-400 dark:text-neutral-600">How can I help you today?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick(suggestion)}
              className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus-visible:outline-neutral-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {messages.map((message, index) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
            image={message.image}
            timestamp={message.timestamp}
            isLast={index === messages.length - 1}
            onRegenerate={onRegenerate}
            regenerating={isTyping}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
        }
