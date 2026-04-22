import { useState } from "react";
import Partitioning from "./components/Partitioning";
import PlaceValue from "./components/PlaceValue";
import ArrayExercise from "./components/ArrayExercise";
import FriendsOf10 from "./components/FriendsOf10";
import Doubles from "./components/Doubles";
import NearDoubles from "./components/NearDoubles";
import QuizMode from "./components/QuizMode";

type Tab =
  | "partitioning"
  | "placevalue"
  | "array"
  | "friends10"
  | "doubles"
  | "neardoubles";
type Mode = "learning" | "quiz";

const TABS: { id: Tab; label: string }[] = [
  { id: "partitioning", label: "Partitioning" },
  { id: "placevalue", label: "Place Value" },
  { id: "array", label: "Arrays" },
  { id: "friends10", label: "Friends of 10" },
  { id: "doubles", label: "Doubles" },
  { id: "neardoubles", label: "Near Doubles" },
];

export default function App() {
  const [mode, setMode] = useState<Mode>("learning");
  const [tab, setTab] = useState<Tab>("array");

  return (
    <div className="app">
      <header className="app-header">
        <h1>17</h1>
        <p>Explore the number seventeen</p>
      </header>

      <nav className="folder-tabs mode-tabs">
        <button
          className={`folder-tab ${mode === "learning" ? "active" : ""}`}
          onClick={() => setMode("learning")}
        >
          Learning Mode
        </button>
        <button
          className={`folder-tab ${mode === "quiz" ? "active" : ""}`}
          onClick={() => setMode("quiz")}
        >
          Quiz Mode
        </button>
      </nav>

      {mode === "learning" && (
        <>
          <nav className="folder-tabs exercise-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`folder-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {tab === "partitioning" && <Partitioning />}
          {tab === "placevalue" && <PlaceValue />}
          {tab === "array" && <ArrayExercise />}
          {tab === "friends10" && <FriendsOf10 />}
          {tab === "doubles" && <Doubles />}
          {tab === "neardoubles" && <NearDoubles />}
        </>
      )}

      {mode === "quiz" && <QuizMode />}
    </div>
  );
}
