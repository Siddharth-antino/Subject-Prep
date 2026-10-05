import { Component, lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Shell from "./library/Shell.jsx";
const PreparationAgent = lazy(
  () => import("./preparation/PreparationAgent.jsx"),
);

class PageBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <section className="empty-state" role="alert">
        <h1>This page couldn’t load.</h1>
        <p>Your saved session and drafts are preserved.</p>
        <button
          className="primary-button"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </section>
    ) : (
      this.props.children
    );
  }
}

export default function App() {
  const location = useLocation();
  return (
    <Shell>
      <PageBoundary key={location.pathname}>
        <Suspense
          fallback={<p role="status">Opening your session workspace…</p>}
        >
          <Routes>
            <Route path="/" element={<PreparationAgent />} />
            <Route path="/prepare" element={<PreparationAgent />} />
            <Route path="/notes/*" element={<Navigate to="/" replace />} />
            <Route path="/interview/*" element={<Navigate to="/" replace />} />
            <Route
              path="*"
              element={
                <section className="empty-state">
                  <h1>Page not found</h1>
                  <Link to="/">Return to the coach</Link>
                </section>
              }
            />
          </Routes>
        </Suspense>
      </PageBoundary>
    </Shell>
  );
}
