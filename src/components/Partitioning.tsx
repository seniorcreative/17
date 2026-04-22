import { useState } from "react";

export default function Partitioning() {
  const [split, setSplit] = useState(10);
  const other = 17 - split;

  return (
    <div className="card">
      <h2>Partitioning</h2>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Split 17 into two parts. Drag or adjust the slider to explore.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          className="big-number"
          style={{ color: "#4f46e5", minWidth: 60, textAlign: "center" }}
        >
          {split}
        </div>
        <div style={{ fontSize: "2rem", color: "#9ca3af" }}>+</div>
        <div
          className="big-number"
          style={{ color: "#f59e0b", minWidth: 60, textAlign: "center" }}
        >
          {other}
        </div>
        <div style={{ fontSize: "2rem", color: "#9ca3af" }}>=</div>
        <div className="big-number">17</div>
      </div>

      <input
        type="range"
        min={0}
        max={17}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: "#4f46e5",
          marginBottom: "1.5rem",
        }}
      />

      <div className="squares-row">
        {Array.from({ length: 17 }, (_, i) => (
          <div
            key={i}
            className={`square ${i < split ? "filled" : "filled-alt"}`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "2rem" }}>
        <div>
          <div
            style={{
              width: 16,
              height: 16,
              background: "#4f46e5",
              borderRadius: 4,
              display: "inline-block",
              marginRight: 6,
            }}
          />
          <span style={{ color: "#6b7280" }}>{split} (first part)</span>
        </div>
        <div>
          <div
            style={{
              width: 16,
              height: 16,
              background: "#f59e0b",
              borderRadius: 4,
              display: "inline-block",
              marginRight: 6,
            }}
          />
          <span style={{ color: "#6b7280" }}>{other} (second part)</span>
        </div>
      </div>
    </div>
  );
}
