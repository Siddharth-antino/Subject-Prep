// Read only this app's known previous keys; keep originals intact for recovery.
const previousKeys = {
  "subject-prep.coach.session.v1": "interview-agent.interviewer.session.v1",
  "subject-prep.coach.voice.v1": "interview-agent.interviewer.voice.v1",
  "subject-prep.theme": "interview-agent.theme",
};
export function readCompatibleSetting(key) {
  const current = localStorage.getItem(key);
  if (current !== null) return current;
  const prefix = Object.keys(previousKeys).find(
    (known) => key === known || key.startsWith(`${known}.`),
  );
  if (!prefix) return null;
  const value = localStorage.getItem(
    previousKeys[prefix] + key.slice(prefix.length),
  );
  if (value !== null) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // A read-only preference remains usable when storage is full.
    }
  }
  return value;
}
