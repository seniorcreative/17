import { useEffect, useState } from "react";

// 17 is close to doubles: 8+8=16, 9+9=18
// We explore doubles up to 10 and highlight where 17 sits
const DOUBLES = Array.from({ length: 10 }, (_, i) => ({
  n: i + 1,
  sum: (i + 1) * 2,
}));
const ANIMATION_SPEEDS = [250, 500, 800];

export default function Doubles() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [intervalMs, setIntervalMs] = useState(500);

  useEffect(() => {
    if (selected === null) {
      setRevealedCount(0);
      return;
    }

    setRevealedCount(0);
  }, [selected]);

  useEffect(() => {
    if (selected === null) {
      return;
    }

    const total = selected * 2;
    if (revealedCount >= total) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRevealedCount((current) => Math.min(current + 1, total));
    }, intervalMs);

    return () => window.clearTimeout(timer);
  }, [selected, revealedCount, intervalMs]);

  const restartAnimation = () => {
    if (selected !== null) {
      setRevealedCount(0);
    }
  };

  return (
    <div className="card">
      <h2>Doubles</h2>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Tap a number to see its double. Notice where 17 falls between doubles!
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {DOUBLES.map(({ n, sum }) => (
          <button
            key={n}
            onClick={() => setSelected(n === selected ? null : n)}
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: 12,
              border: "2px solid",
              borderColor: n === selected ? "#4f46e5" : "#d1d5db",
              background: n === selected ? "#eef2ff" : "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              color: "#1a1a2e",
              position: "relative",
            }}
          >
            {n} + {n} = {sum}
            {sum === 17 - 1 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#f59e0b",
                  color: "white",
                  borderRadius: 999,
                  fontSize: "0.65rem",
                  padding: "2px 5px",
                  fontWeight: 900,
                }}
              >
                17-1
              </span>
            )}
            {sum === 17 + 1 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#4f46e5",
                  color: "white",
                  borderRadius: 999,
                  fontSize: "0.65rem",
                  padding: "2px 5px",
                  fontWeight: 900,
                }}
              >
                17+1
              </span>
            )}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          style={{ background: "#f9fafb", borderRadius: 12, padding: "1rem" }}
        >
          <p
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            {selected} + {selected} = {selected * 2}
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "0.75rem",
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
              onClick={restartAnimation}
            >
              Replay build
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Array.from({ length: selected * 2 }, (_, i) => (
              <div
                key={i}
                className={`square ${i < revealedCount ? (i < selected ? "filled" : "filled-alt") : "empty"}`}
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
              marginTop: "0.75rem",
              fontSize: "0.9rem",
            }}
          >
            Watch the double grow one square at a time to {selected * 2}.
          </p>
        </div>
      )}

      <div
        style={{
          marginTop: "1.5rem",
          background: "#fffbeb",
          borderRadius: 12,
          padding: "1rem",
          borderLeft: "4px solid #f59e0b",
        }}
      >
        <strong>17 is an odd number</strong> - it can't be a double!
        <br />
        <span style={{ color: "#6b7280" }}>
          The nearest doubles are <strong>8 + 8 = 16</strong> and{" "}
          <strong>9 + 9 = 18</strong>.
        </span>
      </div>
    </div>
  );
}
