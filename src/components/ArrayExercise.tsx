import { useState, useRef, useCallback, useEffect } from "react";

const TOTAL = 17;
const CELL = 44;
const GAP = 6;

export default function ArrayExercise() {
  const [cols, setCols] = useState(5);
  const rows = Math.ceil(TOTAL / cols);
  const full = rows * cols;

  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    void clientY;
    const newCols = Math.max(
      1,
      Math.min(TOTAL, Math.round(x / (CELL + GAP) + 0.5)),
    );
    setCols(newCols);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    e.preventDefault();
  };
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging.current) updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer],
  );
  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    updateFromPointer(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (dragging.current)
        updateFromPointer(e.touches[0].clientX, e.touches[0].clientY);
    },
    [updateFromPointer],
  );
  const onTouchEnd = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  const gridWidth = cols * CELL + (cols - 1) * GAP;
  const gridHeight = rows * CELL + (rows - 1) * GAP;

  return (
    <div className="card">
      <h2>Arrays</h2>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Drag the corner handle to reshape the array. 17 squares always.
      </p>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: gridWidth + 24,
          height: gridHeight + 24,
          marginBottom: "1.5rem",
        }}
      >
        {Array.from({ length: full }, (_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const isReal = i < TOTAL;
          return (
            <div
              key={i}
              className={`square ${isReal ? "filled" : "empty"}`}
              style={{
                position: "absolute",
                left: c * (CELL + GAP),
                top: r * (CELL + GAP),
                width: CELL,
                height: CELL,
                fontSize: "0.8rem",
              }}
            >
              {isReal ? i + 1 : ""}
            </div>
          );
        })}

        {/* Corner drag handle */}
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{
            position: "absolute",
            left: gridWidth + 4,
            top: gridHeight + 4,
            width: 16,
            height: 16,
            background: "#4f46e5",
            borderRadius: 4,
            cursor: "nwse-resize",
            border: "2px solid white",
            boxShadow: "0 2px 6px rgba(79,70,229,0.5)",
            zIndex: 10,
          }}
        />
      </div>

      <div
        style={{
          background: "#f9fafb",
          borderRadius: 12,
          padding: "1rem",
          fontFamily: "monospace",
          fontSize: "1.1rem",
        }}
      >
        {rows} row{rows !== 1 ? "s" : ""} x {cols} column{cols !== 1 ? "s" : ""}
        {full === TOTAL
          ? " - perfect rectangle!"
          : ` = ${full} (${full - TOTAL} empty)`}
      </div>
    </div>
  );
}
