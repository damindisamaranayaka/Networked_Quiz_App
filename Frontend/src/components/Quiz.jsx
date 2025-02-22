/*import { useState, useCallback } from 'react';

import QUESTIONS from '../questions.js';
import Question from './Question.jsx';
import Summary from './Summary.jsx';

export default function Quiz() {
  const [userAnswers, setUserAnswers] = useState([]);

  const activeQuestionIndex = userAnswers.length;
  const quizIsComplete = activeQuestionIndex === QUESTIONS.length;

  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer
  ) {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });
  },
  []);

  const handleSkipAnswer = useCallback(
    () => handleSelectAnswer(null),
    [handleSelectAnswer]
  );

  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} />
  }

  return (
    <div id="quiz">
      <Question
        key={activeQuestionIndex}
        index={activeQuestionIndex}
        onSelectAnswer={handleSelectAnswer}
        onSkipAnswer={handleSkipAnswer}
      />
    </div>
  );
}*/

export default function Quiz({ quizData }) {
  const [userAnswers, setUserAnswers] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(quizData); // Initial question from backend

  const handleSelectAnswer = async (selectedAnswer) => {
    setUserAnswers((prev) => [...prev, selectedAnswer]);

    try {
      const response = await fetch("http://localhost:3001/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: selectedAnswer }),
      });

      if (response.ok) {
        const data = await response.json();
        setActiveQuestion(data.nextQuestion);
      } else {
        console.error("Failed to submit answer.");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return activeQuestion ? (
    <div id="quiz">
      <h2>{activeQuestion.text}</h2>
      <Answers
        answers={activeQuestion.answers}
        onSelect={handleSelectAnswer}
      />
    </div>
  ) : (
    <div>Quiz completed!</div>
  );
}
