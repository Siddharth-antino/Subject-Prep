import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  normalizeTheme,
  readTheme,
  resolveTheme,
  THEME_KEY,
} from "../lib/theme.js";
import "./standalone.css";

export default function Shell({ children }) {
  const [preference, setPreference] = useState(readTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches || false,
  );
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const changed = (event) => setSystemDark(event.matches);
    const stored = (event) => {
      if (event.key === THEME_KEY)
        setPreference(normalizeTheme(event.newValue));
    };
    media?.addEventListener("change", changed);
    window.addEventListener("storage", stored);
    return () => {
      media?.removeEventListener("change", changed);
      window.removeEventListener("storage", stored);
    };
  }, []);
  useEffect(() => {
    const theme = resolveTheme(preference, systemDark);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#10121b" : "#f7f7fb");
    try {
      localStorage.setItem(THEME_KEY, preference);
    } catch {
      /* Session-only theme. */
    }
  }, [preference, systemDark]);
  return (
    <div className="agent-workspace">
      <a className="skip-link" href="#main-content">
        Skip to preparation
      </a>
      <header className="agent-header">
        <Link className="agent-brand" to="/">
          subject<span>prep.</span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Prepare
          </NavLink>
        </nav>
        <label className="agent-theme">
          Appearance
          <select
            aria-label="Appearance"
            value={preference}
            onChange={(event) =>
              setPreference(normalizeTheme(event.target.value))
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </header>
      <main id="main-content" className="agent-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="agent-footer">
        One subject. One conversation. Understand, practise, improve.
      </footer>
    </div>
  );
}
