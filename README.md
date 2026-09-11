# AiBros

A clean, minimal AI chat interface built with React, Vite, and Tailwind CSS.

## Features

- Full-screen onboarding ("Hi" → name capture → personalized welcome) on first visit
- "Welcome back" screen for returning users
- Minimal chat UI with sidebar, conversation history, and mobile-responsive layout
- Chat history persisted in `localStorage` (no account required)
- Frontend ready to connect to a real AI backend, with a mock fallback for local dev
- Accessible: labeled inputs, keyboard support, visible focus states, `prefers-reduced-motion` support

## Getting started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (typically `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview   # optional local preview of the build
```

The static site is output to `dist/`.

## Project structure

```
src/
  App.jsx                  Top-level state: onboarding vs chat
  components/
    Onboarding/
      Onboarding.jsx        Hi -> name -> welcome flow
      NameInput.jsx
      WelcomeScreen.jsx     "Welcome back" for returning users
    Chat/
      ChatLayout.jsx        Wires sidebar + chat window + input + settings
      Sidebar.jsx
      ChatWindow.jsx
      Message.jsx
      TypingIndicator.jsx
      ChatInput.jsx
    Settings/
      Settings.jsx          Change stored name, reset onboarding
    common/
      Logo.jsx
  hooks/
    usePrefersReducedMotion.js
  lib/
    storage.js              localStorage helpers
    utils.js                id/title/time helpers
    ai.js                   AI response layer (backend call + mock fallback)
netlify/
  functions/
    chat.js                 Example serverless proxy to an AI provider
netlify.toml                Netlify build + redirect config
```

## Deploying to Netlify

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. In Netlify, click **Add new site → Import an existing project**, and select the repo.
3. Build settings are already defined in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Deploy. Netlify will install dependencies and build automatically.

You can also deploy via the CLI:

```bash
npm install -g netlify-cli
netlify deploy --build --prod
```

## Connecting a real AI API

The frontend never talks to an AI provider directly — it calls `POST /api/chat`
(see `src/lib/ai.js`). If that endpoint isn't available, it falls back to a
short mock reply so the app still works without any backend configured.

An example Netlify Function is already included at `netlify/functions/chat.js`,
proxying to Anthropic's API. To use it:

1. In your Netlify site settings, add an environment variable:
   - `ANTHROPIC_API_KEY` = your real API key
2. Redeploy. `netlify.toml` already redirects `/api/chat` to this function, so
   no frontend changes are needed.
3. **Never** put the API key in frontend code or in a `VITE_`-prefixed
   environment variable — those are bundled into the client-side JavaScript
   and would be publicly visible.

### Using a different provider (e.g. OpenAI)

Edit `netlify/functions/chat.js` to call your provider's endpoint instead,
using an API key read from `process.env` in that same file. The response
shape returned to the frontend should stay `{ reply: "..." }` — nothing else
in the app needs to change.

### Deploying on Vercel instead

Create `api/chat.js` (a Vercel serverless function) with equivalent logic to
`netlify/functions/chat.js`, reading your key from a Vercel environment
variable. Since the frontend calls `/api/chat`, Vercel's default routing
will pick it up automatically — no `netlify.toml` needed.

## Notes

- No login, file upload, or voice input by design — see the project brief.
- Chat history and the stored name live only in the browser's `localStorage`.
  Clearing site data or using a different browser/device starts fresh.
- Users can change their stored name or reset onboarding from the Settings
  panel (gear icon, top right of the chat).
