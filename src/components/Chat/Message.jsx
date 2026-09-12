import { formatTime } from '../../lib/utils';

export default function Message({ role, content, image, timestamp }) {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[85%] flex-col gap-1 sm:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {image && (
          <img
            src={image.previewUrl}
            alt="Attached"
            className="max-h-64 rounded-2xl object-cover"
          />
        )}
        {content && (
          <div
            className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
              isUser ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-800'
            }`}
          >
            {content}
          </div>
        )}
        {timestamp && <span className="px-1 text-xs text-neutral-400">{formatTime(timestamp)}</span>}
      </div>
    </div>
  );
}
