export default function PreparationReview({ session }) {
  return (
    <section className="ia-card ia-results">
      <h2>Your preparation recap</h2>
      <p>
        {session.assessments.length} assessed answers · {session.hintsUsed}{" "}
        hints. Feedback reflects this session only; untested topics remain
        unassessed.
      </p>
      {session.assessments.length ? (
        session.assessments.map((a, i) => (
          <div className="ia-assessment" key={i}>
            <strong>{a.topic}</strong>
            <span className={`ia-verdict ${a.verdict}`}>{a.verdict}</span>
            <p>{a.evidence}</p>
          </div>
        ))
      ) : (
        <p>No technical answers were assessed in this session.</p>
      )}
    </section>
  );
}
