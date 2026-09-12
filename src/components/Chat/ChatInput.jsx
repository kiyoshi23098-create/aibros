import { useRef, useState } from 'react';
import { compressImage, splitDataUrl } from '../../lib/image';

const MAX_ORIGINAL_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  function handleChange(event) {
    setValue(event.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file.');
      return;
    }
    if (file.size > MAX_ORIGINAL_FILE_SIZE) {
      setImageError('That image is too large (max 15MB).');
      return;
    }

    try {
      setImageError('');
      const compressedDataUrl = await compressImage(file);
      const { mimeType, data } = splitDataUrl(compressedDataUrl);
      setAttachedImage({ previewUrl: compressedDataUrl, mimeType, data });
    } catch {
      setImageError("Couldn't process that image. Try a different file.");
    }
  }

  function removeAttachedImage() {
    setAttachedImage(null);
  }

  function handleSend() {
    const trimmed = value.trim();
    if ((!trimmed && !attachedImage) || disabled) return;
    onSend(trimmed, attachedImage);
    setValue('');
    setAttachedImage(null);
    setImageError('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const canSend = Boolean((value.trim() || attachedImage) && !disabled);

  return (
    <div className="border-t border-neutral-200 bg-white px-4 py-4 sm:px-8">
      <div className="mx-auto max-w-3xl">
        {attachedImage && (
          <div className="mb-2 flex items-center gap-2">
            <div className="relative">
              <img
                src={attachedImage.previewUrl}
                alt="Attached preview"
                className="h-16 w-16 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeAttachedImage}
                aria-label="Remove attached image"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {imageError && <p className="mb-2 text-xs text-red-500">{imageError}</p>}

        <div className="flex items-end gap-2 rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 transition-colors focus-within:border-neutral-400">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach an image"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a1.5 1.5 0 01-2.12-2.12l8.49-8.48"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <label htmlFor="chat-input" className="sr-only">
            Message AiBros
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message AiBros"
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-opacity disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12L20 4L14 20L11 13L4 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-neutral-400">
        AiBros can make mistakes. Consider checking important information.
      </p>
    </div>
  );
                }
