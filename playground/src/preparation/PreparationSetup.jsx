import { Mic, ArrowRight, Clock3, Sparkles, RotateCcw } from "lucide-react";
import VoiceSettings from "./VoiceSettings.jsx";
import { TRACKS } from "../lib/content.js";
import { PHASES, LABELS, STAGES } from "./session.js";
export default function PreparationSetup({ controller, notices }) {
  const {
    subject,
    setSubject,
    experience,
    setExperience,
    language,
    setLanguage,
    voiceOn,
    setVoiceOn,
    handsFree,
    setHandsFree,
    voice,
    busy,
    health,
    start,
    savedId,
    resumeSaved,
  } = controller;
  return (
    <div className="ia-page">
      <div className="ia-eyebrow">
        <Sparkles size={15} /> YOUR SUBJECT PREPARATION COACH
      </div>
      <h1>
        Talk it through.
        <br />
        <span>Understand it better.</span>
      </h1>
      <p className="ia-lead">
        Choose a subject and learn through conversation. Explore concepts,
        explain your thinking, and work through practical scenarios with a coach
        that remembers your progress.
      </p>
      <div className="ia-setup-grid">
        <section className="ia-card ia-setup">
          <h2>What do you want to prepare?</h2>
          <label>
            Subject
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {TRACKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <div className="ia-fields">
            <label>
              Current level
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="beginner">Starting out</option>
                <option value="intermediate">Know the basics</option>
                <option value="experienced">Ready to go deeper</option>
              </select>
            </label>
            <label>
              Conversation
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="hinglish">Hinglish</option>
                <option value="english">English</option>
              </select>
            </label>
          </div>
          <label className="ia-check">
            <input
              type="checkbox"
              checked={voiceOn}
              onChange={(e) => setVoiceOn(e.target.checked)}
            />{" "}
            Read coach replies aloud
          </label>
          <label className="ia-check">
            <input
              type="checkbox"
              checked={handsFree}
              disabled={!voice.supported}
              onChange={(e) => setHandsFree(e.target.checked)}
            />{" "}
            Automatic voice · listen, transcribe, and reply
          </label>
          <VoiceSettings voice={voice} disabled={busy} />
          <p className="ia-small">
            Start preparing, allow your mic once, and talk after the coach
            finishes. Your words appear as you speak; a short pause sends your
            answer automatically. Voice needs microphone access. Recordings are
            sent to Gemini for transcription; coach replies use Gemini
            text-to-speech. Raw audio is not saved by this app. Sessions are
            saved in the configured session storage.
          </p>
          {!voice.supported && (
            <p className="ia-notice">
              Microphone capture isn’t available here. You can still complete
              the session by typing.
            </p>
          )}
          {notices}
          <button
            className="primary-button ia-start"
            disabled={busy || health?.configured === false}
            onClick={start}
          >
            <Mic size={18} />
            {busy ? "Getting your coach ready…" : "Start preparing"}
            <ArrowRight size={17} />
          </button>
          {health?.configured === false && (
            <p className="ia-notice">
              Add GEMINI_API_KEY to the root .env and restart the session
              server.
            </p>
          )}
          {savedId && (
            <button
              className="text-button ia-resume"
              disabled={busy}
              onClick={resumeSaved}
            >
              <RotateCcw size={15} /> Continue last session
            </button>
          )}
        </section>
        <aside className="ia-card ia-agenda">
          <div className="ia-agenda-title">
            <Clock3 size={20} />
            <strong>One subject. One focused hour.</strong>
          </div>
          {PHASES.map((phase, i) => (
            <div className="ia-agenda-item" key={phase}>
              <span>0{i + 1}</span>
              <div>
                <h3>{LABELS[phase]}</h3>
                <p>
                  {
                    [
                      "Your learning goal, current understanding, and where to focus.",
                      "Short explanations, questions, and corrections at your pace.",
                      "Talk through a scenario or solution, with hints when you need them.",
                      "What clicked, what needs work, and your next practice step.",
                    ][i]
                  }
                </p>
              </div>
              <small>{STAGES[i]}</small>
            </div>
          ))}
          <div className="ia-note">
            “Let’s try another example. What would happen if the cached data
            changed?”
            <span>
              Learn a concept, explain it back, then put it into practice.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
