# Subject Prep requirements and verification

Scope: local conversational preparation. Deterministic tests verify mechanisms, not every model response or a complete hour of physical microphone use.

| Requirement | Implementation | Boundary |
| --- | --- | --- |
| Conversation-only preparation | Goal-based greeting, coaching prompts, one preparation screen, no notes pages or editor | Optional typing and visible captions remain available |
| Eight subjects | Subject-scoped reference retrieval, questions, practical exercises and memory | Difficulty and explanation quality need human evaluation |
| Brain, loop, tools and guardrails | Gemini adapter, bounded runtime, validated role tools and replies | No arbitrary tool/code execution |
| Hub and specialist memories | Goal, concepts, applied practice, recap; scoped histories and handoffs | Roles run sequentially |
| Explanations, corrections and hints | Short dialogue, check-transfer questions, progressive hints | Model correctness remains fallible |
| Practical preparation by talking | One assigned exercise adapted to verbal reasoning | No required implementation or code correctness claims |
| Short- and long-term memory | Role histories plus dated topic assessments across saved sessions | Bounded normalized-topic recall, not exhaustive semantic memory |
| Reminders and improvement | Exact memory IDs, dated reminder and latest-verdict comparison | Topic identity is not exact question identity |
| Automatic voice in every phase | Live captions, finalized answers, streaming TTS and playback handoff | Alternating turns; explicit interruption; quota/device dependent |
| Pause, resume and recovery | Server clock, draft persistence, idempotent retries and atomic commits | One local learner; no account sync |
| Upgrade continuity | Compatible browser preference reads and explicit database/collection settings | Existing storage must remain configured |

## Checks

Run `npm run check` from the root. Coverage includes session lifecycle, role ownership, phase-boundary answers, evidence-based assessments, practical tasks, memory reminders, fallback rollback, voice cancellation, prompt/tool limits, storage isolation, source grounding, captions, playback and UI routes.

Run `npm run db:check` only for an explicit live database check with temporary synthetic records. Remaining acceptance work includes physical microphone/echo behavior, a complete hour of conversation, and a curated human-reviewed coaching-quality evaluation. Public deployment needs authentication, ownership, retention and spend controls.

See [architecture](PREPARATION_ARCHITECTURE.md) and [audit](AGENT_AUDIT.md).
