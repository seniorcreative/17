import { useState, useRef, useCallback } from "react";

const TOTAL = 17;
const SQUARE_SIZE = 44;
const GAP = 6;

export default function DragBar() {
  const [split, setSplit] = useState(8);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSplitFromX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const totalWidth = TOTAL * SQUARE_SIZE + (TOTAL - 1) * GAP;
    const fraction = Math.max(0, Math.min(1, x / totalWidth));
    const newSplit = Math.round(fraction * TOTAL);
    setSplit(Math.max(0, Math.min(TOTAL, newSplit)));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    updateSplitFromX(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) updateSplitFromX(e.clientX);
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    updateSplitFromX(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (dragging.current) updateSplitFromX(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    dragging.current = false;
  };

  const barLeft = split === 0 ? 0 : split * (SQUARE_SIZE + GAP) - GAP / 2 - 3;

  return (
    <div className="card">
      <h2>Drag the Bar</h2>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Drag the bar through the 17 squares to see the split. Left + Right = 17.
      </p>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "inline-flex",
          gap: GAP,
          cursor: "ew-resize",
          userSelect: "none",
          paddingBottom: "0.5rem",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {Array.from({ length: TOTAL }, (_, i) => (
          <div
            key={i}
            className={`square ${i < split ? "filled" : "filled-alt"}`}
            style={{
              width: SQUARE_SIZE,
              height: SQUARE_SIZE,
              fontSize: "0.85rem",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
        ))}

        {/* The draggable dividing bar */}
        {split > 0 && split < TOTAL && (
          <div
            style={{
              position: "absolute",
              left: barLeft,
              top: 0,
              bottom: 0,
              width: 6,
              background: "#1a1a2e",
              borderRadius: 3,
              zIndex: 10,
              cursor: "ew-resize",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          />
        )}
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="big-number" style={{ color: "#4f46e5" }}>
            {split}
          </div>
          <div className="label">Left (blue)</div>
        </div>
        <div style={{ fontSize: "2.5rem", color: "#9ca3af" }}>+</div>
        <div style={{ textAlign: "center" }}>
          <div className="big-number" style={{ color: "#f59e0b" }}>
            {TOTAL - split}
          </div>
          <div className="label">Right (amber)</div>
        </div>
        <div style={{ fontSize: "2.5rem", color: "#9ca3af" }}>=</div>
        <div style={{ textAlign: "center" }}>
          <div className="big-number">17</div>
          <div className="label">Total</div>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="range"
          min={0}
          max={17}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#4f46e5" }}
        />
      </div>

      <div
        style={{
          marginTop: "1rem",
          background: "#f9fafb",
          borderRadius: 12,
          padding: "0.75rem",
          color: "#6b7280",
          fontSize: "0.95rem",
        }}
      >
        {split === 0 && "All 17 are on the right."}
        {split === TOTAL && "All 17 are on the left."}
        {split > 0 && split < TOTAL && (
          <>
            When there are <strong>{split}</strong> on the left, there are{" "}
            <strong>{TOTAL - split}</strong> on the right.
          </>
        )}
      </div>
    </div>
  );
}
