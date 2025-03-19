import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Quizapp.css";

export default function QuizApp() {
  const [socket, setSocket] = useState(null);
  const [correctanswer, setCorrectAnswer] = useState("");
  const [question, setQuestion] = useState(null);
  const [selectedanswer, setselectedAnswer] = useState("");
  const [answerSubmitted, setanswerSubmitted] = useState(false);
  const [timer, setTimer] = useState(10);
  const [quizFinished, setQuizFinished] = useState(false);
  const [summary, setSummary] = useState({
    correctAnswers: 0,
    totalquestions: 0,
    
  });

  useEffect(() => {
    const newSocket = io("http://192.168.247.51:3001"); 
    setSocket(newSocket);

   
    newSocket.on("question", (questionData) => {
      setQuestion(questionData);
      setTimer(10); 
      setanswerSubmitted(false);
      setCorrectAnswer(""); 
    });


    newSocket.on("finished", (data) => {
      setSummary(data.summary);                                                                                                                           //alert(`Quiz finished!\nCorrect Answers: ${data.summary.correctAnswers}\nTotal Questions: ${data.summary.totalquestions}`);
      setQuestion(null);
      setQuizFinished(true); 
    });

  
    newSocket.on("nextQuestion", (nextQuestionData) => {
      setQuestion(nextQuestionData); 
    });


    return () => {
      if (newSocket) {
        newSocket.off("question");
        newSocket.off("finished");
        newSocket.off("nextQuestion");
        newSocket.close();
      }
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !answerSubmitted && !quizFinished) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !answerSubmitted && !quizFinished) {
      handleAutoSubmit();
 
       setselectedAnswer("");
    }
  }, [timer, answerSubmitted , quizFinished]);


  const handleAutoSubmit = () => {
    setanswerSubmitted(true);
    if (socket && selectedanswer) {
      
    }

  
    if (question.correctanswer === selectedanswer) {
      setCorrectAnswer(selectedanswer);
      socket.emit("correctanswer", selectedanswer);
    } else {
      setCorrectAnswer(question.correctanswer);
      socket.emit("correctanswer", question.correctanswer);
    }
    setTimeout(() => {
      if (!selectedanswer) {
        socket.emit("submitanswer", "user skipped the answer"); 
      } else {
      
        socket.emit("submitanswer", selectedanswer);
      }
   
    }, 3000);
  };

  

  return (
    <div>
      <div>
        {quizFinished ? (
          <div className="quiz-summary">
            <h2>Quiz Finished!</h2>
            <p>Correct Answers: {summary.correctAnswers}</p>
            <p>Total Questions: {summary.totalquestions}</p>
           
          </div>
        ) : (
          <div>
            {question ? (
              <div id="quiz">
                <h2>{question.text}</h2>
                <p>Time remaining: {timer} seconds</p>
                <ul id="answers">
                  {question.answers.map((ans, index) => (
                    <li
                      key={index}
                      className={`answer ${
                        answerSubmitted
                          ? ans === correctanswer
                            ? "correct"
                            :  ans !== correctanswer
                            ? "incorrect"
                            : ""
                          : ""
                      }`}
                    >
                      <button
                        disabled={answerSubmitted || timer === 0}
                        onClick={() => setselectedAnswer(ans)}
                      >
                        {ans}
                      </button>
                    </li>
                  ))}
                </ul>
                {answerSubmitted && (
                  <p className="correct-answer">
                    Correct Answer: {correctanswer}
                  </p>
                )}
              </div>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}






