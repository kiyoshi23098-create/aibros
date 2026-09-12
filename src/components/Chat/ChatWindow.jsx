import { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <p className="text-lg text-neutral-400">How can I help you today?</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
            image={message.image}
            timestamp={message.timestamp}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
