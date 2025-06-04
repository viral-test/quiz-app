import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [quiz, setQuiz] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  function handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setQuiz(json);
      setIndex(0);
      setAnswers(Array(json.length).fill(null));
      setSubmitted(false);
    };

    reader.readAsArrayBuffer(file);
  }

  function selectOption(option) {
    const updated = [...answers];
    updated[index] = option;
    setAnswers(updated);
  }

  function submitQuiz() {
    setSubmitted(true);
  }

  if (quiz.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Upload Quiz Excel File</h1>
        <input type="file" accept=".xlsx, .xls" onChange={handleUpload} />
      </div>
    );
  }

  if (submitted) {
    const score = quiz.reduce(
      (acc, q, i) => (answers[i] === q["Correct Answer"] ? acc + 1 : acc),
      0
    );
    return (
      <div style={{ padding: 20 }}>
        <h1>Quiz Completed</h1>
        <p>Your Score: {score} / {quiz.length}</p>
      </div>
    );
  }

  const current = quiz[index];
  const options = ["A", "B", "C", "D"];

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Question {index + 1}</h2>
      <p>{current.Question}</p>
      {options.map((opt) => (
        <div key={opt}>
          <label>
            <input
              type="radio"
              name="option"
              value={opt}
              checked={answers[index] === opt}
              onChange={() => selectOption(opt)}
            />
            {current[`Option ${opt}`]}
          </label>
        </div>
      ))}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setIndex(index - 1)} disabled={index === 0}>
          Previous
        </button>{" "}
        <button
          onClick={() => setIndex(index + 1)}
          disabled={index === quiz.length - 1}
        >
          Next
        </button>{" "}
        {index === quiz.length - 1 && (
          <button onClick={submitQuiz}>Submit</button>
        )}
      </div>
    </div>
  );
}
