# Contributing to Subject Prep

Read `AGENTS.md` and the architecture guide first. Keep the product centered on spoken subject preparation: learning goals, concepts, applied reasoning and recap. Every exercise must be answerable through conversation.

Use the canonical question bank under `playground/src/data/` and internal subject references in `notes/` when updating grounding content. Preserve IDs used by stored assessments. Verify explanations against their linked sources and keep qualifications and examples intact.

Keep provider calls, credentials, private answer guides and persistent memory on the server. Tests should mock external services and use isolated temporary stores. Add meaningful regressions for changed behavior and run `npm run check` from the root.

For frontend changes, check keyboard controls, voice cancellation, narrow layouts and both themes. Do not log credentials or raw microphone audio. Document relevant limits and any checks that could not be completed.
