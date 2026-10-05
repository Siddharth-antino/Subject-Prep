import test, { after } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";

const dom = new JSDOM(
  '<!doctype html><meta name="theme-color"><div id="root"></div>',
  {
    url: "http://localhost:5174/",
    pretendToBeVisual: true,
  },
);
for (const key of ["window", "document", "HTMLElement", "localStorage"])
  globalThis[key] = dom.window[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.matchMedia = () => ({
  matches: false,
  addEventListener() {},
  removeEventListener() {},
});
const originalFetch = globalThis.fetch;
let savedSession;
globalThis.fetch = async (url) =>
  Response.json(
    url.endsWith("/health")
      ? { configured: true, storage: "mongodb" }
      : savedSession,
  );
const server = await createServer({
  configFile: false,
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom", "react-router-dom"] },
  server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  appType: "custom",
  logLevel: "error",
});
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { MemoryRouter } = await import("react-router-dom");
const { default: App } = await server.ssrLoadModule("/src/App.jsx");
const { KEY } = await server.ssrLoadModule("/src/preparation/storage.js");
let root;
async function mount(path = "/") {
  if (root) await React.act(() => root.unmount());
  root = createRoot(document.getElementById("root"));
  await React.act(async () =>
    root.render(
      React.createElement(
        MemoryRouter,
        { initialEntries: [path] },
        React.createElement(App),
      ),
    ),
  );
  for (let i = 0; i < 50 && !document.querySelector("main h1"); i++)
    await React.act(
      async () => new Promise((resolve) => setTimeout(resolve, 20)),
    );
}
after(async () => {
  if (root) await React.act(() => root.unmount());
  await server.close();
  globalThis.fetch = originalFetch;
  dom.window.close();
});

test("preparation home has eight subjects, automatic voice, and one focused destination", async () => {
  localStorage.setItem(
    "other-app.coach.session.v1",
    "unrelated-session-must-not-resume",
  );
  await mount("/");
  assert.match(
    document.querySelector("main h1").textContent,
    /Understand it better/,
  );
  assert.deepEqual(
    [...document.querySelectorAll('nav[aria-label="Main navigation"] a')].map(
      (a) => a.textContent,
    ),
    ["Prepare"],
  );
  const subject = [...document.querySelectorAll("label")]
    .find((l) => l.textContent.trim().startsWith("Subject"))
    .querySelector("select");
  assert.equal(subject.options.length, 8);
  assert.ok([...subject.options].some((option) => option.value === "dsa"));
  assert.ok(
    [...document.querySelectorAll('input[type="checkbox"]')].every(
      (input) => input.checked,
    ),
  );
  assert.doesNotMatch(
    document.querySelector("main").textContent,
    /Resume \/ view last session/,
  );
  assert.equal(
    document.querySelector(".skip-link").getAttribute("href"),
    "#main-content",
  );
});

test("preparation route and both appearance settings remain usable", async () => {
  await mount("/prepare");
  const appearance = document.querySelector('select[aria-label="Appearance"]');
  for (const theme of ["dark", "light"]) {
    await React.act(async () => {
      appearance.value = theme;
      appearance.dispatchEvent(new window.Event("change", { bubbles: true }));
    });
    assert.equal(document.documentElement.dataset.theme, theme);
    assert.equal(localStorage.getItem("subject-prep.theme"), theme);
  }
  assert.equal(localStorage.getItem("other-app.theme"), null);
});

test("retired reading and session addresses return to subject preparation", async () => {
  for (const path of ["/notes", "/notes/js-closures", "/interview/live"]) {
    await mount(path);
    assert.match(
      document.querySelector("main h1").textContent,
      /Understand it better/,
    );
    assert.equal(document.querySelector('a[href^="/notes"]'), null);
    assert.equal(document.querySelector(".agent-reference"), null);
  }
});

test("applied practice and recap stay conversational without an editor or chapter links", async () => {
  for (const status of ["active", "completed"]) {
    savedSession = {
      id: "test-session",
      subject: "javascript",
      language: "english",
      phase: status === "active" ? "coding" : "review",
      status,
      durationMinutes: 60,
      elapsedMs: 0,
      runningSince: Date.now(),
      hintsUsed: 1,
      coding: {
        title: "Reason about a cache",
        prompt: "Explain an eviction policy.",
      },
      messages: [
        {
          id: "m1",
          role: "assistant",
          phase: "coding",
          text: "What would you evict first?",
          reviewChapterIds: ["js-closures"],
        },
      ],
      assessments: [
        {
          topic: "Caching",
          verdict: "partial",
          evidence: "Explained expiration.",
          chapterId: "js-closures",
        },
      ],
    };
    localStorage.setItem(KEY, savedSession.id);
    await mount("/");
    const resume = [...document.querySelectorAll("button")].find((b) =>
      b.textContent.includes("Continue last session"),
    );
    await React.act(async () => resume.click());
    assert.match(
      document.querySelector("main").textContent,
      /What would you evict first/,
    );
    assert.equal(document.querySelector(".ia-code-editor"), null);
    assert.equal(document.querySelector('a[href^="/notes"]'), null);
    if (status === "active") assert.ok(document.getElementById("prep-answer"));
    else
      assert.match(
        document.querySelector("main").textContent,
        /Your preparation recap/,
      );
  }
  localStorage.removeItem(KEY);
});
