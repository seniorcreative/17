import { useState, useCallback } from "react";

function getQuestion() {
  const n = Math.floor(Math.random() * 10) + 1;
  return n;
}

function TenFrame({
  filled,
  colorClass,
}: {
  filled: number;
  colorClass: "filled" | "filled-alt";
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 40px)",
        gap: 6,
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`square ${i < filled ? colorClass : "empty"}`}
        />
      ))}
    </div>
  );
}

export default function FriendsOf10() {
  const [base, setBase] = useState(getQuestion);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [revealed, setRevealed] = useState(false);

  const friendOf10 = 10 - base; // how many more to reach 10 from base
  const toSeventeen = 17 - base; // how many more to reach 17
  const leftoverFromSeven = 7 - friendOf10;

  const check = useCallback(() => {
    const num = Number(answer);
    if (num === friendOf10) {
      setFeedback("correct");
      setRevealed(true);
    } else {
      setFeedback("incorrect");
    }
  }, [answer, friendOf10]);

  const next = () => {
    setBase(getQuestion());
    setAnswer("");
    setFeedback(null);
    setRevealed(false);
  };

  return (
    <div className="card">
      <h2>Friends of 10</h2>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Friends of 10 are pairs that add up to 10. We can make 10 first, then
        join the rest of the 7 to reach 17.
      </p>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#4f46e5",
            }}
          >
            {base} in the first ten frame
          </div>
          <TenFrame filled={base} colorClass="filled" />
        </div>

        <div>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#f59e0b",
            }}
          >
            The 7 we can join on
          </div>
          <TenFrame filled={7} colorClass="filled-alt" />
        </div>
      </div>

      <div style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
        Use some of the 7 to make 10: <strong>{base}</strong> + ? ={" "}
        <strong>10</strong>
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
          max={10}
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
          {feedback === "correct" ? "Correct!" : "Not quite, try again!"}
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
          <p>
            <strong>
              {base} + {friendOf10} = 10
            </strong>
          </p>
          <div
            style={{
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
              marginTop: "1rem",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "#4f46e5",
                }}
              >
                Made 10
              </div>
              <TenFrame filled={10} colorClass="filled" />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "#f59e0b",
                }}
              >
                Left from the 7
              </div>
              <TenFrame filled={leftoverFromSeven} colorClass="filled-alt" />
            </div>
          </div>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
            We used <strong>{friendOf10}</strong> from the 7 to fill the first
            ten frame, leaving <strong>{leftoverFromSeven}</strong>.
          </p>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
            So{" "}
            <strong>
              {base} + {friendOf10} + {leftoverFromSeven} = 17
            </strong>
            , and that means{" "}
            <strong>
              {base} + {toSeventeen} = 17
            </strong>
            .
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
    </div>
  );
}
