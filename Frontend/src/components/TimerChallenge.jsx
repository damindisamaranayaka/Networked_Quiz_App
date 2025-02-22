import React, { useState, useRef } from "react";
import Quiz from "./Quiz";
import QuizApp from "../Quizapp.jsx";

function TimerChallenge({ title }) {
  const [showQuiz, setShowQuiz] = useState(false);
  function handleStart() {
    setShowQuiz(true);
  }

  return (
    <>
      <section className="challenge">
        <h2>{title}</h2>
        <p className="challenge-time">5 minitues</p>
        {!showQuiz && (
          <p>
            <button onClick={handleStart}>Start Quiz</button>
          </p>
        )}
      </section>
      {showQuiz && <QuizApp />}
    </>
  );
}

export default TimerChallenge;

/*import React, { useState } from "react";
import Quiz from "./Quiz";

function TimerChallenge({ title }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);

  async function handleStart() {
    // Send a request to the backend to start the quiz
    try {
      const response = await fetch("http://localhost:3001/start-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: "example-client-id", // Replace with the actual clientId
          question: "Start Quiz", // Placeholder; customize as needed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuizData(data.question);
        setShowQuiz(true);
      } else {

        console.error("Failed to start quiz.");
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  }

  return (
    <>
      <section className="challenge">
        <h2>{title}</h2>
        <p className="challenge-time">5 minutes</p>
        {!showQuiz && (
          <p>
            <button onClick={handleStart}>Start Quiz</button>
          </p>
        )}
      </section>
      {showQuiz && <Quiz quizData={quizData} />}
    </>
  );
}

export default TimerChallenge;

*/