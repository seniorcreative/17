import { useState, useRef, useCallback, useEffect } from "react";

const CELL = 32;
const GAP = 5;
const MIN_SHIFT = -2;
const MAX_SHIFT = 3;
const DECIMAL_STEPS = [-2, -1, 0, 1, 2, 3];

function DraggableArray({
  count,
  color,
  borderColor,
  bg,
}: {
  count: number;
  color: string;
  borderColor: string;
  bg: string;
}) {
  const [cols, setCols] = useState(Math.min(count, 5));
  const rows = Math.ceil(count / cols);
  const full = rows * cols;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newCols = Math.max(
        1,
        Math.min(count, Math.round(x / (CELL + GAP) + 0.5)),
      );
      setCols(newCols);
    },
    [count],
  );

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    e.preventDefault();
  };
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging.current) updateFromPointer(e.clientX);
    },
    [updateFromPointer],
  );
  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    updateFromPointer(e.touches[0].clientX);
  };
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (dragging.current) updateFromPointer(e.touches[0].clientX);
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

  const gridW = cols * CELL + (cols - 1) * GAP;
  const gridH = rows * CELL + (rows - 1) * GAP;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: gridW + 20,
        height: gridH + 20,
        border: `2px solid ${borderColor}`,
        borderRadius: 10,
        padding: 6,
        background: bg,
        display: "inline-block",
      }}
    >
      {Array.from({ length: full }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const isReal = i < count;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 6 + c * (CELL + GAP),
              top: 6 + r * (CELL + GAP),
              width: CELL,
              height: CELL,
              borderRadius: 6,
              background: isReal ? color : "transparent",
              border: isReal ? "none" : "1px dashed #d1d5db",
              opacity: isReal ? 1 : 0.4,
            }}
          />
        );
      })}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          position: "absolute",
          right: 2,
          bottom: 2,
          width: 14,
          height: 14,
          background: borderColor,
          borderRadius: 3,
          cursor: "nwse-resize",
          border: "2px solid white",
          boxShadow: `0 1px 4px ${borderColor}80`,
          zIndex: 10,
        }}
      />
    </div>
  );
}

function clampShift(next: number): number {
  return Math.max(MIN_SHIFT, Math.min(MAX_SHIFT, next));
}

function formatValue(shift: number): string {
  if (shift <= 0) {
    return (17 * Math.pow(10, -shift)).toLocaleString();
  }
  return (17 / Math.pow(10, shift)).toFixed(shift);
}

function formatPlaceValueValue(exponent: number): string {
  if (exponent >= 0) {
    return String(Math.pow(10, exponent));
  }

  return (1 / Math.pow(10, Math.abs(exponent))).toFixed(Math.abs(exponent));
}

function placeLabel(shift: number): string {
  const labels: Record<string, string> = {
    "-2": "17 × 100 = 1,700",
    "-1": "17 × 10 = 170",
    "0": "17 = 1 ten and 7 ones",
    "1": "17 ÷ 10 = 1.7",
    "2": "17 ÷ 100 = 0.17",
    "3": "17 ÷ 1000 = 0.017",
  };
  return labels[String(shift)] ?? "";
}

function formatUnitLabel(count: number, unit: string): string {
  if (count === 1) {
    return `1 ${unit.replace(/s$/, "")}`;
  }

  return `${count} ${unit}`;
}

function digitPlaceLabels(shift: number): [string, string] {
  const places = [
    "thousandths",
    "hundredths",
    "tenths",
    "ones",
    "tens",
    "hundreds",
    "thousands",
  ];
  const rightIdx = 3 - shift;
  const leftIdx = rightIdx + 1;
  const get = (i: number) =>
    places[Math.max(0, Math.min(places.length - 1, i))];
  return [formatUnitLabel(1, get(leftIdx)), formatUnitLabel(7, get(rightIdx))];
}

function DecimalPointControl({
  shift,
  setShift,
}: {
  shift: number;
  setShift: (next: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      if (!railRef.current) return;

      const rect = railRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const rawShift = MIN_SHIFT + percent * (MAX_SHIFT - MIN_SHIFT);
      setShift(clampShift(Math.round(rawShift)));
    },
    [setShift],
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (dragging.current) {
        updateFromClientX(event.clientX);
      }
    },
    [updateFromClientX],
  );

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      if (dragging.current) {
        updateFromClientX(event.touches[0].clientX);
      }
    },
    [updateFromClientX],
  );

  const stopDragging = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [onMouseMove, onTouchMove, stopDragging]);

  const leftPercent = ((shift - MIN_SHIFT) / (MAX_SHIFT - MIN_SHIFT)) * 100;

  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: 12,
        padding: "1rem 1.25rem",
        marginBottom: "1rem",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
        Move the decimal point
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <button
          className="action-btn"
          style={{ marginTop: 0 }}
          onClick={() => setShift(clampShift(shift - 1))}
          disabled={shift === MIN_SHIFT}
        >
          ×10
        </button>
        <button
          className="action-btn"
          style={{ marginTop: 0, background: "#f59e0b" }}
          onClick={() => setShift(clampShift(shift + 1))}
          disabled={shift === MAX_SHIFT}
        >
          ÷10
        </button>
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "0.9rem",
          marginBottom: "0.75rem",
        }}
      >
        Drag the decimal point on the track, or use ×10 and ÷10.
      </div>

      <div
        ref={railRef}
        onMouseDown={(event) => {
          dragging.current = true;
          updateFromClientX(event.clientX);
        }}
        onTouchStart={(event) => {
          dragging.current = true;
          updateFromClientX(event.touches[0].clientX);
        }}
        style={{
          position: "relative",
          padding: "1.75rem 0 2.5rem",
          cursor: "ew-resize",
          userSelect: "none",
        }}
      >
        <div
          style={{
            height: 8,
            borderRadius: 999,
            background: "linear-gradient(90deg, #cbd5e1 0%, #e2e8f0 100%)",
          }}
        />

        {DECIMAL_STEPS.map((step) => {
          const percent = ((step - MIN_SHIFT) / (MAX_SHIFT - MIN_SHIFT)) * 100;
          return (
            <button
              key={step}
              onClick={() => setShift(step)}
              style={{
                position: "absolute",
                left: `${percent}%`,
                top: 12,
                transform: "translateX(-50%)",
                width: 14,
                height: 14,
                borderRadius: 999,
                border:
                  step === shift ? "3px solid #1a1a2e" : "2px solid #64748b",
                background: step === shift ? "#f59e0b" : "white",
                cursor: "pointer",
              }}
              aria-label={`Set decimal position to ${formatValue(step)}`}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: `${leftPercent}%`,
            top: -2,
            transform: "translateX(-50%)",
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "#1a1a2e",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: 900,
            boxShadow: "0 6px 14px rgba(15, 23, 42, 0.25)",
            pointerEvents: "none",
          }}
        >
          .
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            marginTop: "1rem",
          }}
        >
          {DECIMAL_STEPS.map((step) => (
            <div
              key={step}
              style={{
                minWidth: 48,
                textAlign: "center",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                color: step === shift ? "#1a1a2e" : "#6b7280",
                fontWeight: step === shift ? 800 : 600,
              }}
            >
              {formatValue(step)}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ marginTop: "0.25rem", color: "#6b7280", fontSize: "0.9rem" }}
      >
        The digits are always <strong>1</strong> and <strong>7</strong> - only
        the decimal point moves.
      </div>
    </div>
  );
}

export default function PlaceValue() {
  const [shift, setShift] = useState(0);
  const value = formatValue(shift);
  const [leftPlace, rightPlace] = digitPlaceLabels(shift);

  return (
    <div className="card">
      <h2>Place Value</h2>
      <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
        Drag the corner of each array to reshape it. Move the decimal point to
        see how 17 scales up and down.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <DraggableArray
            count={10}
            color="#4f46e5"
            borderColor="#4f46e5"
            bg="#eef2ff"
          />
          <div style={{ fontWeight: 700, color: "#4f46e5", marginTop: 6 }}>
            1
          </div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            {leftPlace}
          </div>
        </div>

        <div
          style={{ fontSize: "2.5rem", color: "#9ca3af", paddingTop: "1rem" }}
        >
          +
        </div>

        <div style={{ textAlign: "center" }}>
          <DraggableArray
            count={7}
            color="#f59e0b"
            borderColor="#f59e0b"
            bg="#fffbeb"
          />
          <div style={{ fontWeight: 700, color: "#f59e0b", marginTop: 6 }}>
            7
          </div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            {rightPlace}
          </div>
        </div>

        <div
          style={{ fontSize: "2.5rem", color: "#9ca3af", paddingTop: "1rem" }}
        >
          =
        </div>

        <div style={{ textAlign: "center", paddingTop: "0.5rem" }}>
          <div
            style={{
              fontSize: "2.8rem",
              fontWeight: 900,
              color: "#1a1a2e",
              fontFamily: "monospace",
              letterSpacing: 2,
            }}
          >
            {value}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: 4 }}>
            {placeLabel(shift)}
          </div>
        </div>
      </div>

      <DecimalPointControl shift={shift} setShift={setShift} />

      <div
        style={{
          background: "#f9fafb",
          borderRadius: 12,
          padding: "1rem",
          fontFamily: "monospace",
          fontSize: "1.05rem",
        }}
      >
        {value} = (1 × {formatPlaceValueValue(1 - shift)}) + (7 ×{" "}
        {formatPlaceValueValue(-shift)})
      </div>
    </div>
  );
}
