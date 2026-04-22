import { useEffect, useMemo, useState } from "react";

type QuizBand = "foundation-1" | "level-2-3" | "level-4-6";
type QuizResult = "correct" | "incorrect" | "timeout" | null;

type Question = {
  prompt: string;
  answers: string[];
  explanation: string;
  curriculumHint: string;
};

const BAND_DETAILS: Record<QuizBand, { label: string; description: string }> = {
  "foundation-1": {
    label: "Foundation to Year 1",
    description:
      "Counting to 20, one more or one less, simple addition and subtraction, and tens-and-ones place value.",
  },
  "level-2-3": {
    label: "Years 2 to 3",
    description:
      "Partitioning, arrays, repeated addition, odd and even, doubles and near doubles, and related facts.",
  },
  "level-4-6": {
    label: "Years 4 to 6",
    description:
      "Prime numbers, factors and multiples, decimal place value, and multiplying or dividing by powers of 10.",
  },
};

const TIMER_OPTIONS = [0, 20, 45, 90];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalize(text: string): string {
  return text.replace(/\s+/g, "").replace(/,/g, "").toLowerCase();
}

function decimalValue(shift: number): string {
  if (shift <= 0) {
    return String(17 * Math.pow(10, -shift));
  }

  return (17 / Math.pow(10, shift)).toFixed(shift);
}

function buildFoundationQuestion(): Question {
  const questionType = randomInt(1, 6);

  if (questionType === 1) {
    const left = randomInt(0, 17);
    return {
      prompt: `Complete: ${left} + ? = 17`,
      answers: [String(17 - left)],
      explanation: `${left} and ${17 - left} make 17.`,
      curriculumHint:
        "Aligned to Foundation and Year 1 addition and subtraction modelling and counting to 20.",
    };
  }

  if (questionType === 2) {
    const offset = randomInt(1, 3);
    return {
      prompt: `What is ${offset} less than 17?`,
      answers: [String(17 - offset)],
      explanation: `${17 - offset} is ${offset} less than 17.`,
      curriculumHint:
        "Aligned to counting back and simple subtraction within 20.",
    };
  }

  if (questionType === 3) {
    const offset = randomInt(1, 3);
    return {
      prompt: `What is ${offset} more than 17?`,
      answers: [String(17 + offset)],
      explanation: `${17 + offset} is ${offset} more than 17.`,
      curriculumHint: "Aligned to counting on and simple addition within 20.",
    };
  }

  if (questionType === 4) {
    return {
      prompt: "Place value: 17 is 1 ten and how many ones?",
      answers: ["7"],
      explanation: "17 = 1 ten + 7 ones.",
      curriculumHint:
        "Aligned to early place value and partitioning into tens and ones.",
    };
  }

  if (questionType === 5) {
    return {
      prompt: "What number comes just before 17?",
      answers: ["16"],
      explanation: "16 comes before 17 in the counting sequence.",
      curriculumHint:
        "Aligned to ordering and sequencing numbers to at least 20.",
    };
  }

  return {
    prompt: "What number comes just after 17?",
    answers: ["18"],
    explanation: "18 comes after 17 in the counting sequence.",
    curriculumHint:
      "Aligned to ordering and sequencing numbers to at least 20.",
  };
}

function buildLevel23Question(): Question {
  const questionType = randomInt(1, 7);

  if (questionType === 1) {
    const left = randomInt(1, 16);
    return {
      prompt: `Partition 17: ${left} + ? = 17`,
      answers: [String(17 - left)],
      explanation: `${left} + ${17 - left} = 17.`,
      curriculumHint:
        "Aligned to Year 2-3 partitioning and efficient addition and subtraction strategies.",
    };
  }

  if (questionType === 2) {
    const n = randomInt(1, 8);
    return {
      prompt: `Near doubles: ${n} + ${n + 1} = ?`,
      answers: [String(n + n + 1)],
      explanation: `${n} + ${n} = ${n + n}, then add 1 more to make ${n + n + 1}.`,
      curriculumHint:
        "Aligned to recall of addition facts and near-doubles strategies.",
    };
  }

  if (questionType === 3) {
    return {
      prompt: "Is 17 odd or even?",
      answers: ["odd"],
      explanation:
        "17 is odd because it cannot be split into two equal whole-number groups.",
      curriculumHint: "Aligned to Year 3 odd and even number properties.",
    };
  }

  if (questionType === 4) {
    return {
      prompt:
        "Nearest doubles around 17: complete 8+8 = __ and 9+9 = __ (enter as a,b)",
      answers: ["16,18", "16 18"],
      explanation: "17 sits between the doubles 16 and 18.",
      curriculumHint: "Aligned to doubles facts and using nearby known facts.",
    };
  }

  if (questionType === 5) {
    return {
      prompt:
        "Two doubles fit into 17 with 1 left over. Which double is used twice?",
      answers: ["4+4", "4 + 4", "double 4", "4"],
      explanation:
        "4+4 is 8. Two lots of 8 make 16, leaving 1 more to reach 17.",
      curriculumHint:
        "Aligned to repeated addition, doubles and flexible decomposition of 17.",
    };
  }

  if (questionType === 6) {
    const rows = randomInt(2, 4);
    const cols = randomInt(2, 4);
    const total = rows * cols;
    return {
      prompt: `An array has ${rows} rows of ${cols}. How many more are needed to make 17?`,
      answers: [String(17 - total)],
      explanation: `${rows} × ${cols} = ${total}, so ${17 - total} more are needed to make 17.`,
      curriculumHint:
        "Aligned to arrays and multiplication as repeated addition.",
    };
  }

  return {
    prompt: "Complete the fact family: 10 + 7 = 17, so 17 - 10 = ?",
    answers: ["7"],
    explanation: "If 10 + 7 = 17, then 17 - 10 = 7.",
    curriculumHint:
      "Aligned to the connection between addition and subtraction.",
  };
}

function buildLevel46Question(): Question {
  const questionType = randomInt(1, 7);

  if (questionType === 1) {
    return {
      prompt: "Is 17 a prime number or a composite number?",
      answers: ["prime"],
      explanation: "17 has exactly two factors: 1 and 17, so it is prime.",
      curriculumHint:
        "Aligned to Year 5-6 number properties and prime or composite numbers.",
    };
  }

  if (questionType === 2) {
    return {
      prompt: "List the factor pair for 17 as a,b",
      answers: ["1,17", "17,1", "1 17", "17 1"],
      explanation: "The only whole-number factor pair of 17 is 1 and 17.",
      curriculumHint: "Aligned to factors, multiples and divisibility.",
    };
  }

  if (questionType === 3) {
    const shift = [-2, -1, 1, 2, 3][randomInt(0, 4)];
    const direction =
      shift < 0
        ? `${Math.abs(shift)} place(s) right`
        : `${shift} place(s) left`;
    return {
      prompt: `Move the decimal point in 17 by ${direction}. What is the new value?`,
      answers: [decimalValue(shift)],
      explanation: `The new value is ${decimalValue(shift)}.`,
      curriculumHint:
        "Aligned to decimal place value and multiplying or dividing by powers of 10.",
    };
  }

  if (questionType === 4) {
    return {
      prompt:
        "Order these from smallest to largest: 17, 1.7, 0.17 (enter as a,b,c)",
      answers: ["0.17,1.7,17", "0.17 1.7 17"],
      explanation:
        "Tenths are smaller than ones, and whole numbers are greater than decimals less than 1.",
      curriculumHint: "Aligned to comparing and ordering decimals.",
    };
  }

  if (questionType === 5) {
    return {
      prompt: "Complete: 17 = 2 × ? + 1",
      answers: ["8"],
      explanation: "2 × 8 = 16, and 1 more makes 17.",
      curriculumHint:
        "Aligned to odd-number structure and multiplicative reasoning.",
    };
  }

  if (questionType === 6) {
    const divisor = randomInt(2, 5);
    const quotient = Math.floor(17 / divisor);
    const remainder = 17 % divisor;
    return {
      prompt: `Divide 17 by ${divisor}. Write your answer as quotient r remainder`,
      answers: [`${quotient}r${remainder}`, `${quotient} r ${remainder}`],
      explanation: `17 ÷ ${divisor} = ${quotient} remainder ${remainder}.`,
      curriculumHint:
        "Aligned to division, remainders and efficient whole-number strategies.",
    };
  }

  return {
    prompt: "Which is larger: 17 tenths or 17 hundredths?",
    answers: ["17 tenths", "tenths"],
    explanation:
      "17 tenths is 1.7, while 17 hundredths is 0.17. So 17 tenths is larger.",
    curriculumHint:
      "Aligned to decimal place value and comparing tenths and hundredths.",
  };
}

function buildQuestion(band: QuizBand): Question {
  if (band === "foundation-1") {
    return buildFoundationQuestion();
  }

  if (band === "level-2-3") {
    return buildLevel23Question();
  }

  return buildLevel46Question();
}

export default function QuizMode() {
  const [band, setBand] = useState<QuizBand>("level-2-3");
  const [timeLimit, setTimeLimit] = useState(0);
  const [question, setQuestion] = useState<Question>(() =>
    buildQuestion("level-2-3"),
  );
  const [input, setInput] = useState("");
  const [result, setResult] = useState<QuizResult>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0, timeouts: 0 });

  const acceptedAnswers = useMemo(
    () => question.answers.map(normalize),
    [question.answers],
  );

  useEffect(() => {
    setQuestion(buildQuestion(band));
    setInput("");
    setResult(null);
  }, [band]);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [question, timeLimit]);

  useEffect(() => {
    if (timeLimit === 0 || result !== null || timeLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [timeLeft, timeLimit, result]);

  useEffect(() => {
    if (timeLimit === 0 || timeLeft !== 0 || result !== null) {
      return;
    }

    setResult("timeout");
    setScore((prev) => ({
      correct: prev.correct,
      total: prev.total + 1,
      timeouts: prev.timeouts + 1,
    }));
  }, [timeLeft, timeLimit, result]);

  const checkAnswer = () => {
    if (result !== null) {
      return;
    }

    const cleaned = normalize(input);
    const isCorrect = acceptedAnswers.includes(cleaned);

    setResult(isCorrect ? "correct" : "incorrect");
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      timeouts: prev.timeouts,
    }));
  };

  const nextQuestion = () => {
    setQuestion(buildQuestion(band));
    setInput("");
    setResult(null);
  };

  const resetScore = () => {
    setScore({ correct: 0, total: 0, timeouts: 0 });
    setQuestion(buildQuestion(band));
    setInput("");
    setResult(null);
  };

  const percent =
    score.total === 0 ? 0 : Math.round((score.correct / score.total) * 100);

  return (
    <div className="card">
      <h2>Quiz Mode</h2>
      <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
        Random questions about 17, grouped into Victorian curriculum-style
        bands.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {Object.entries(BAND_DETAILS).map(([bandKey, details]) => (
          <button
            key={bandKey}
            onClick={() => setBand(bandKey as QuizBand)}
            style={{
              padding: "0.6rem 0.95rem",
              borderRadius: 12,
              border: "2px solid",
              borderColor: band === bandKey ? "#4f46e5" : "#d1d5db",
              background: band === bandKey ? "#eef2ff" : "white",
              color: "#1a1a2e",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {details.label}
          </button>
        ))}
      </div>

      <div
        style={{
          marginBottom: "1rem",
          background: "#f9fafb",
          borderRadius: 12,
          padding: "1rem",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>
          {BAND_DETAILS[band].label}
        </div>
        <div style={{ color: "#6b7280", marginBottom: "0.75rem" }}>
          {BAND_DETAILS[band].description}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 600 }}>Timer:</span>
          {TIMER_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setTimeLimit(option)}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: 999,
                border: "2px solid",
                borderColor: timeLimit === option ? "#f59e0b" : "#d1d5db",
                background: timeLimit === option ? "#fffbeb" : "white",
                color: "#1a1a2e",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {option === 0 ? "Off" : `${option}s`}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          background: "#eef2ff",
          borderRadius: 12,
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "0.5rem",
          }}
        >
          <div style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            {question.prompt}
          </div>
          <div
            style={{
              fontWeight: 800,
              color:
                timeLimit === 0
                  ? "#6b7280"
                  : timeLeft <= 5
                    ? "#dc2626"
                    : "#4f46e5",
            }}
          >
            {timeLimit === 0 ? "No timer" : `${timeLeft}s`}
          </div>
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (result) setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          placeholder="Type your answer"
          disabled={result === "timeout"}
          style={{
            width: "100%",
            maxWidth: 320,
            padding: "0.5rem 0.75rem",
            border: "2px solid #d1d5db",
            borderRadius: 8,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          className="action-btn"
          style={{ marginTop: 0 }}
          onClick={checkAnswer}
          disabled={result === "timeout"}
        >
          Check
        </button>
        <button
          className="action-btn"
          style={{ marginTop: 0, background: "#16a34a" }}
          onClick={nextQuestion}
        >
          Next question
        </button>
        <button
          className="action-btn"
          style={{ marginTop: 0, background: "#6b7280" }}
          onClick={resetScore}
        >
          Reset score
        </button>
      </div>

      {result && (
        <div
          className={`feedback ${result === "correct" ? "correct" : "incorrect"}`}
        >
          {result === "correct" && "Correct!"}
          {result === "incorrect" &&
            `Not quite. One correct answer is ${question.answers[0]}.`}
          {result === "timeout" &&
            `Time is up. One correct answer is ${question.answers[0]}.`}
        </div>
      )}

      <div
        style={{
          marginTop: "1rem",
          background: "#f9fafb",
          borderRadius: 12,
          padding: "1rem",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
          Why this question fits this level
        </div>
        <div style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
          {question.curriculumHint}
        </div>
        <div style={{ color: "#1a1a2e" }}>{question.explanation}</div>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          background: "#f9fafb",
          borderRadius: 12,
          padding: "1rem",
        }}
      >
        <strong>Score:</strong> {score.correct}/{score.total} ({percent}%)
        <div style={{ marginTop: "0.35rem", color: "#6b7280" }}>
          Timeouts: {score.timeouts}
        </div>
      </div>
    </div>
  );
}
