import test from 'node:test';
import assert from 'node:assert/strict';
import { readCompatibleSetting } from '../src/lib/storageCompatibility.js';
import { KEY, readSaved, readDraft } from '../src/preparation/storage.js';
import { readTheme } from '../src/lib/theme.js';

test('existing preferences and interrupted drafts survive the preparation namespace change', (t) => {
  const previous = 'interview-agent.interviewer.session.v1';
  const draft = JSON.stringify({ draft: 'Explain closures', code: 'old draft', pending: { action: 'answer', requestId: 'same-request' } });
  const values = new Map([
    [previous, 'saved-session'], [`${previous}.saved-session`, draft],
    ['interview-agent.theme', 'dark'],
    ['interview-agent.interviewer.voice.v1', '{"silenceMs":7000}'],
  ]);
  const original = globalThis.localStorage;
  t.after(() => { globalThis.localStorage = original; });
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(readSaved(), 'saved-session');
  assert.equal(values.get(KEY), 'saved-session');
  assert.equal(readDraft('saved-session').pending.requestId, 'same-request');
  assert.equal(readDraft('saved-session').code, 'old draft');
  assert.equal(readTheme(), 'dark');
  assert.equal(readCompatibleSetting('subject-prep.coach.voice.v1'), '{"silenceMs":7000}');
  assert.equal(values.get(`${previous}.saved-session`), draft);
  values.set(KEY, 'new-session');
  assert.equal(readSaved(), 'new-session');
  values.set('subject-prep.theme', 'light');
  assert.equal(readTheme(), 'light');
});

test('compatible reads preserve values even when storage cannot write', (t) => {
  const original = globalThis.localStorage;
  t.after(() => { globalThis.localStorage = original; });
  globalThis.localStorage = {
    getItem: (key) => key === 'interview-agent.theme' ? 'dark' : null,
    setItem: () => { throw new Error('Storage full'); },
  };
  assert.equal(readTheme(), 'dark');
  assert.equal(readCompatibleSetting('unrelated-app.setting'), null);
});
