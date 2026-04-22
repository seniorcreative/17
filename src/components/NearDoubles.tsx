import { useState, useCallback, useEffect } from "react";

// Near doubles: a + (a+1) or a + (a-1)
// 17 itself: 8+9=17, 7+10? no, only adjacent.
// Exercise: show a near-double equation with one box missing

function makeQuestion() {
  const a = Math.floor(Math.random() * 8) + 1; // 1..8
  const b = a + 1;
  const sum = a + b;
  const hideLeft = Math.random() < 0.5;
  return { a, b, sum, hideLeft };
}

const ANIMATION_SPEEDS = [250, 500, 800];

export default function NearDoubles() {
  const [q, setQ] = useState(makeQuestion);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [revealed, setRevealed] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [intervalMs, setIntervalMs] = useState(500);

  const correct = q.hideLeft ? q.a : q.b;

  useEffect(() => {
    if (!revealed) {
      setRevealedCount(0);
      return;
    }

    setRevealedCount(0);
  }, [revealed, q]);

  useEffect(() => {
    if (!revealed) {
      return;
    }

    if (revealedCount >= q.sum) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRevealedCount((current) => Math.min(current + 1, q.sum));
    }, intervalMs);

    return () => window.clearTimeout(timer);
  }, [revealed, revealedCount, q.sum, intervalMs]);

  const check = useCallback(() => {
    if (Number(answer) === correct) {
      setFeedback("correct");
      setRevealed(true);
    } else {
      setFeedback("incorrect");
    }
  }, [answer, correct]);

  const next = () => {
    setQ(makeQuestion());
    setAnswer("");
    setFeedback(null);
    setRevealed(false);
    setRevealedCount(0);
  };

  const replayBuild = () => {
    if (revealed) {
      setRevealedCount(0);
    }
  };

  return (
    <div className="card">
      <h2>Near Doubles</h2>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Near doubles are sums of two consecutive numbers (like 8 + 9 = 17). Use
        the double to help you!
      </p>

      <div
        style={{
          background: "#eef2ff",
          borderRadius: 12,
          padding: "1rem",
          marginBottom: "1.5rem",
          display: "inline-block",
        }}
      >
        <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>
          {q.hideLeft ? (
            <>
              ? + {q.b} = {q.sum}
            </>
          ) : (
            <>
              {q.a} + ? = {q.sum}
            </>
          )}
        </span>
      </div>

      <div
        style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.95rem" }}
      >
        Hint: {q.a} + {q.a} = {q.a * 2}, so {q.a} + {q.b} = …
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          marginBottom: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="number"
          min={0}
          max={17}
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setFeedback(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <button className="action-btn" style={{ marginTop: 0 }} onClick={check}>
          Check
        </button>
        <button
          className="action-btn"
          style={{ marginTop: 0, background: "#6b7280" }}
          onClick={() => setRevealed(true)}
        >
          Show answer
        </button>
      </div>

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === "correct" ? "That's it!" : "Not quite - try again!"}
        </div>
      )}

      {revealed && (
        <div
          style={{
            marginTop: "1rem",
            background: "#f9fafb",
            borderRadius: 12,
            padding: "1rem",
          }}
        >
          <p style={{ fontWeight: 700 }}>
            {q.a} + {q.b} = {q.sum}
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "0.75rem 0",
            }}
          >
            <span style={{ fontWeight: 600, color: "#6b7280" }}>
              Build speed:
            </span>
            {ANIMATION_SPEEDS.map((speed) => (
              <button
                key={speed}
                onClick={() => setIntervalMs(speed)}
                style={{
                  padding: "0.35rem 0.7rem",
                  borderRadius: 999,
                  border: "2px solid",
                  borderColor: intervalMs === speed ? "#4f46e5" : "#d1d5db",
                  background: intervalMs === speed ? "#eef2ff" : "white",
                  color: "#1a1a2e",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {speed}ms
              </button>
            ))}
            <button
              className="action-btn"
              style={{ marginTop: 0 }}
              onClick={replayBuild}
            >
              Replay build
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginTop: "0.75rem",
            }}
          >
            {Array.from({ length: q.sum }, (_, i) => (
              <div
                key={i}
                className={`square ${i < revealedCount ? (i < q.a ? "filled" : "filled-alt") : "empty"}`}
                style={{
                  opacity: i < revealedCount ? 1 : 0.45,
                  transform: i < revealedCount ? "scale(1)" : "scale(0.92)",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
              />
            ))}
          </div>
          <p
            style={{
              color: "#6b7280",
              marginTop: "0.5rem",
              fontSize: "0.9rem",
            }}
          >
            {q.a} + {q.a} = {q.a * 2}, then add 1 more = {q.sum}
          </p>
        </div>
      )}

      <button
        className="action-btn"
        style={{ background: "#16a34a" }}
        onClick={next}
      >
        Next question
      </button>

      <div
        style={{
          marginTop: "1.5rem",
          background: "#fffbeb",
          borderRadius: 12,
          padding: "1rem",
          borderLeft: "4px solid #f59e0b",
        }}
      >
        <strong>Key fact:</strong> 8 + 9 = <strong>17</strong> - the star
        near-double for this app!
      </div>
    </div>
  );
}
