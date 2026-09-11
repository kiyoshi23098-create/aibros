import Logo from '../common/Logo';

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
}) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-64 flex-shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 transition-transform duration-300 ease-out md:static md:z-auto md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-4">
          <Logo size="sm" />
        </div>

        <div className="px-3">
          <button
            type="button"
            onClick={onNew}
            className="flex w-full items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <span aria-hidden="true">+</span>
            New chat
          </button>
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto px-3 pb-4" aria-label="Conversation history">
          <ul className="flex flex-col gap-0.5">
            {conversations.map((conv) => (
              <li key={conv.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(conv.id)}
                  className={`w-full truncate rounded-lg px-3 py-2 pr-8 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                    conv.id === activeId
                      ? 'bg-neutral-200/70 text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {conv.title || 'New conversation'}
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(conv.id);
                  }}
                  aria-label={`Delete conversation: ${conv.title || 'New conversation'}`}
                  className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 rounded-md px-1.5 py-1 text-xs text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 group-hover:block focus-visible:block"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          {conversations.length === 0 && (
            <p className="px-3 py-2 text-sm text-neutral-400">No conversations yet</p>
          )}
        </nav>
      </aside>
    </>
  );
}
