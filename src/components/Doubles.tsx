import { useEffect, useState } from "react";

// 17 is close to doubles: 8+8=16, 9+9=18
// We explore doubles up to 10 and highlight where 17 sits
const DOUBLES = Array.from({ length: 10 }, (_, i) => ({
  n: i + 1,
  sum: (i + 1) * 2,
}));
const ANIMATION_SPEEDS = [250, 500, 800];

export default function Doubles() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [intervalMs, setIntervalMs] = useState(500);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentDouble = DOUBLES[currentIndex];
  const total = currentDouble.sum;

  useEffect(() => {
    setRevealedCount(0);
  }, [currentIndex]);

  useEffect(() => {
    if (revealedCount >= total) {
      if (!isPlaying || currentIndex >= DOUBLES.length - 1) {
        return;
      }

      const timer = window.setTimeout(() => {
        setCurrentIndex((index) => Math.min(index + 1, DOUBLES.length - 1));
      }, intervalMs);

      return () => window.clearTimeout(timer);
    }

    if (!isPlaying && revealedCount > 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRevealedCount((current) => Math.min(current + 1, total));
    }, intervalMs);

    return () => window.clearTimeout(timer);
  }, [currentIndex, revealedCount, intervalMs, isPlaying, total]);

  const restartAnimation = () => {
    setCurrentIndex(0);
    setRevealedCount(0);
    setIsPlaying(true);
  };

  const jumpToDouble = (index: number) => {
    setCurrentIndex(index);
    setRevealedCount(0);
    setIsPlaying(false);
  };

  return (
    <div className="card">
      <h2>Doubles</h2>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Watch the doubles build in order: 1 + 1 = 2, then 2 + 2 = 4, and so on.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {DOUBLES.map(({ n, sum }, index) => (
          <button
            key={n}
            onClick={() => jumpToDouble(index)}
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: 12,
              border: "2px solid",
              borderColor: index === currentIndex ? "#4f46e5" : "#d1d5db",
              background: index === currentIndex ? "#eef2ff" : "white",
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

      <div style={{ background: "#f9fafb", borderRadius: 12, padding: "1rem" }}>
        <p
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          {currentDouble.n} + {currentDouble.n} = {currentDouble.sum}
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
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            {isPlaying ? "Pause progression" : "Play progression"}
          </button>
          <button
            className="action-btn"
            style={{ marginTop: 0, background: "#16a34a" }}
            onClick={restartAnimation}
          >
            Replay from 1 + 1
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Array.from({ length: currentDouble.sum }, (_, i) => (
            <div
              key={i}
              className={`square ${i < revealedCount ? (i < currentDouble.n ? "filled" : "filled-alt") : "empty"}`}
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
          This progression builds doubles in order, ending near 17 with 8 + 8 =
          16 and 9 + 9 = 18.
        </p>
      </div>

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
