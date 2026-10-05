import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, access, lstat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  loadContent,
  subjects,
  ROOT,
} from "../../server/knowledge/repository.mjs";

test("all eight session subjects have local knowledge, coding tasks and linked examples", async () => {
  const content = await loadContent();
  assert.deepEqual(subjects.map((s) => s.id).sort(), [
    "dsa",
    "java",
    "javascript",
    "mongodb",
    "react",
    "react-native",
    "spring-boot",
    "system-design",
  ]);
  const ids = new Set(content.notes.map((note) => note.id));
  assert.equal(ids.size, content.notes.length);
  assert.equal(content.notes.length, 112);
  for (const { id } of subjects) {
    assert.ok(content.notes.some((note) => note.track === id));
    assert.ok(
      content.questions.some(
        (q) => q.track === id && q.tags?.includes("machine-coding"),
      ),
    );
    for (const name of await readdir(resolve(ROOT, "notes", id))) {
      if (!name.endsWith(".md")) continue;
      const file = resolve(ROOT, "notes", id, name);
      const markdown = await readFile(file, "utf8");
      for (const match of markdown.matchAll(
        /\]\((\.\.\/\.\.\/examples\/[^)]+)\)/g,
      ))
        await access(resolve(dirname(file), match[1]));
    }
  }
});

test("standalone config resolves to this checkout and uses isolated default ports/storage", async () => {
  const actualRoot = fileURLToPath(new URL("../../", import.meta.url));
  assert.equal(resolve(ROOT), resolve(actualRoot));
  // Only print non-secret configuration fields from the child process.
  const script = `import {loadConfig} from './server/config.mjs'; const c=loadConfig(); console.log(JSON.stringify({port:c.port,web:c.webPort,preview:c.previewPort,db:c.mongoDatabase,origins:[...c.allowedOrigins]}));`;
  const env = {
    ...process.env,
    PREP_PORT: "8788",
    PREP_WEB_PORT: "5174",
    PREP_PREVIEW_PORT: "4174",
    MONGODB_DB: "subject_prep",
  };
  const config = JSON.parse(
    execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      cwd: ROOT,
      env,
      encoding: "utf8",
    }),
  );
  assert.equal(config.port, 8788);
  assert.equal(config.web, 5174);
  assert.equal(config.preview, 4174);
  assert.equal(config.db, "subject_prep");
  assert.ok(config.origins.includes("http://127.0.0.1:5174"));
  assert.ok(!config.origins.includes("http://127.0.0.1:9999"));
});

test("application sources have no symlinks or machine-specific imports", async () => {
  async function inspect(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
      const file = resolve(folder, entry.name);
      assert.equal(
        (await lstat(file)).isSymbolicLink(),
        false,
        `Shared link: ${file}`,
      );
      if (entry.isDirectory()) await inspect(file);
      else if (/\.(mjs|jsx?|json)$/.test(entry.name)) {
        const source = await readFile(file, "utf8");
        assert.doesNotMatch(
          source,
          /(?:from\s*|import\s*\()["'][^"']*(?:\/Users\/|\/home\/|[A-Za-z]:[\\/])/,
        );
      }
    }
  }
  await inspect(resolve(ROOT, "server"));
  await inspect(resolve(ROOT, "playground/src"));
});

test("draft, voice and theme namespaces belong to the standalone app", async () => {
  for (const file of [
    "preparation/storage.js",
    "preparation/useVoice.js",
    "lib/theme.js",
  ]) {
    const source = await readFile(
      new URL(`../src/${file}`, import.meta.url),
      "utf8",
    );
    assert.match(source, /subject-prep\./);
  }
});
