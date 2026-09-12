import { useEffect, useRef, useState } from 'react';
import { compressImage, splitDataUrl } from '../../lib/image';

const MAX_ORIGINAL_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const textareaRef = useRef(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const attachMenuRef = useRef(null);

  useEffect(() => {
    if (!showAttachMenu) return undefined;

    function handleOutsideClick(event) {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target)) {
        setShowAttachMenu(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setShowAttachMenu(false);
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showAttachMenu]);

  function handleChange(event) {
    setValue(event.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }

  async function processFile(file) {
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

  function handleGalleryChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    processFile(file);
  }

  function handleCameraChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    processFile(file);
  }

  function openGallery() {
    setShowAttachMenu(false);
    galleryInputRef.current?.click();
  }

  function openCamera() {
    setShowAttachMenu(false);
    cameraInputRef.current?.click();
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
    <div className="border-t border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
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
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {imageError && <p className="mb-2 text-xs text-red-500 dark:text-red-400">{imageError}</p>}

        <div className="flex items-end gap-2 rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 transition-colors focus-within:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:border-neutral-500">
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />

          <div className="relative" ref={attachMenuRef}>
            <button
              type="button"
              onClick={() => setShowAttachMenu((v) => !v)}
              aria-label="Attach an image"
              aria-haspopup="menu"
              aria-expanded={showAttachMenu}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus-visible:outline-neutral-100"
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

            {showAttachMenu && (
              <div
                role="menu"
                className="absolute bottom-12 left-0 z-10 w-40 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={openGallery}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus-visible:outline-neutral-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path
                      d="M21 15l-5-5L5 21"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Photo
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={openCamera}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus-visible:outline-neutral-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 8a2 2 0 012-2h1.5l1-1.5h7l1 1.5H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  Camera
                </button>
              </div>
            )}
          </div>

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
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-opacity disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:focus-visible:outline-neutral-100"
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
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-neutral-400 dark:text-neutral-600">
        AiBros can make mistakes. Consider checking important information.
      </p>
    </div>
  );
              }
