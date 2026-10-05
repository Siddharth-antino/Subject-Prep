# Subject Prep

Prepare **JavaScript, React, React Native, Java, Spring Boot, Node & MongoDB, DSA, and System Design** through conversation with an AI coach.

Pick a subject and talk about what you want to understand. The coach explains concepts, asks focused questions, helps you reason through practical scenarios, and revisits weak topics from earlier sessions. Everything happens in the conversation: no notes tab, reading workspace, or code editor. Typing is available alongside voice.

## Features

- Automatic voice with live captions, streamed spoken replies, interruption controls and Replay.
- English and Hinglish, with adjustable voice, playback speed and thinking pauses.
- Learning goals → concept practice → applied reasoning → recap and next steps.
- Progressive hints, corrections and feedback based on what you actually explained.
- Separate specialist memories plus long-term recall with dated reminders and improvement tracking.
- One focused hour per session, with pause/resume, early finish, draft recovery and transcript export.
- Gemini model selection and bounded fallback when quota or provider availability allows.

The server uses subject references and a question bank to ground its coaching. Reference files are internal learning material, not a notes feature. Practical exercises are discussed verbally; code is never executed.

## Run locally

Use Node.js 22.12 or later. From the root:

```sh
npm run setup
# Create .env from .env.example if absent and set the server credentials.
npm run dev
```

Open **http://127.0.0.1:5174**. The API runs on **8788**, and production preview on **4174**. Set `PREP_WEB_PORT`, `PREP_PORT` and `PREP_PREVIEW_PORT` to change them.

| Command | Purpose |
| --- | --- |
| `npm run setup` | Install locked frontend and backend dependencies |
| `npm run dev` | Start the app and API together |
| `npm run check` | Run regression tests, lint and production build |
| `npm run build` | Build the web app |
| `npm start` | Start the API |
| `npm run preview` | Preview the web build; run the API separately |
| `npm run db:check` | Check MongoDB using temporary synthetic records |
| `npm run db:migrate` | Import configured JSON sessions without overwriting existing records |

## Storage and configuration

Set `GEMINI_API_KEY` and optional `MONGODB_URI` in the ignored root `.env`. Keep credentials on the server, never in `VITE_*` variables. See `.env.example` for reasoning fallback and speech models. Quotas depend on the configured Gemini project.

With MongoDB configured, defaults are database `subject_prep`, collection `preparation_sessions`, and learner `local`. `MONGODB_DB`, `MONGODB_COLLECTION` and `MONGODB_LEARNER_ID` explicitly select storage. Preserve those settings when continuing existing learning history. A configured but unavailable database fails startup instead of silently switching stores.

An empty MongoDB URI uses JSON in `.sessions/`, configurable through `PREP_STORAGE_DIR`. Session assessments are the source of long-term memory. Temporary context is not persisted as a separate learner profile. Raw microphone audio is not stored. Browser preferences use the `subject-prep` namespace; existing local preferences and drafts are read compatibly.

## Project structure

```text
server/agent/                Hub, specialists, bounded loop, prompts and guardrails
server/providers/            Reasoning, model fallback, transcription and speech
server/tools/                Validated reference retrieval and practical exercises
server/memory/               Cross-session recall and dated reminders
server/sessions/             Session lifecycle, timing and atomic turns
server/storage/              MongoDB and JSON adapters
playground/src/preparation/  Conversational preparation UI, voice and recovery
playground/src/library/      App shell and conversation rendering
playground/src/data/         Server question bank
notes/, examples/            Internal subject reference material
docs/                       Architecture, requirements and verification
```

GitHub Actions runs checks with mocked providers and no real credentials. Review staged changes before publishing; private history, `.env`, dependencies and builds are ignored. This is a local single-learner application. Public hosting requires authentication, ownership checks and deployment configuration.

See [architecture](docs/PREPARATION_ARCHITECTURE.md), [requirements](docs/REQUIREMENTS_VERIFICATION.md), and [audit](docs/AGENT_AUDIT.md).
