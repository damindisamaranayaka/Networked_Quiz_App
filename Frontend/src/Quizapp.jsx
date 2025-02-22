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
  // Set up WebSocket connection
  useEffect(() => {
    const newSocket = io("http://192.168.247.51:3001"); 
    setSocket(newSocket);

    // Listen for questions from the server
    newSocket.on("question", (questionData) => {
      setQuestion(questionData);
      setTimer(10); // Reset timer for each question
      setanswerSubmitted(false);
      setCorrectAnswer(""); // Reset correct answer
    });

    // Listen for quiz completion message
    newSocket.on("finished", (data) => {
      setSummary(data.summary);                                                                                                                           //alert(`Quiz finished!\nCorrect Answers: ${data.summary.correctAnswers}\nTotal Questions: ${data.summary.totalquestions}`);
      setQuestion(null);
      setQuizFinished(true); // Clear the question
    });

    // Listen for the next question
    newSocket.on("nextQuestion", (nextQuestionData) => {
      setQuestion(nextQuestionData); // Update state with the next question
    });

    // Clean up the socket connection
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
       // Automatically submit when the timer runs out
       setselectedAnswer("");
    }
  }, [timer, answerSubmitted , quizFinished]);

  // Automatically submit an answer
  const handleAutoSubmit = () => {
    setanswerSubmitted(true);
    if (socket && selectedanswer) {
      
    }

    // Highlight correct/incorrect answers
    if (question.correctanswer === selectedanswer) {
      setCorrectAnswer(selectedanswer);
      socket.emit("correctanswer", selectedanswer);
    } else {
      setCorrectAnswer(question.correctanswer);
      socket.emit("correctanswer", question.correctanswer);
    }
    setTimeout(() => {
      if (!selectedanswer) {
        socket.emit("submitanswer", "user skipped the answer"); // Emit a 'skipped' status to the server
      } else {
        // Emit the selected answer
        socket.emit("submitanswer", selectedanswer);
      }
     // Notify the server to send the next question
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
                            : /*ans === selectedanswer &&*/ ans !== correctanswer
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






// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import "./Quizapp.css";

// export default function QuizApp  ()  {
//   const [socket, setSocket] = useState(null);
//   const [correctanswer, setCorrectAnswer] = useState("");
//   const [question, setQuestion] = useState(null);
//   const [selectedanswer, setselectedAnswer] = useState("");
//   //const [quizStarted, setQuizStarted] = useState(false);
//   const [answerSubmitted, setanswerSubmitted] = useState(false); // New state for name submission confirmation
//   const [timer , setTimer] = useState(10);
//   // Set up WebSocket connection
//   useEffect(() => {
//     const newSocket = io("http://localhost:3001"); // Connect to WebSocket server
//     setSocket(newSocket);

//     // Listen for questions from the server
//     newSocket.on("question", (questionData) => {
//       setQuestion(questionData);
//       setTimer(10);
//       setanswerSubmitted(false);
//       setCorrectAnswer(""); // Update state with the received question
//     });

//     // Listen for quiz completion message
//     newSocket.on("finished", (message) => {
//       alert(message); // Alert when the quiz is finished
     
//       setQuestion(null); // Clear the question
//     });

//     // Clean up the socket connection when the component is unmounted
//     return () => {
//       if (newSocket) {
//         newSocket.off("question");
//         newSocket.off("finished");
//         newSocket.close();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (timer > 0 && !answerSubmitted) {
//       const interval = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//       return () => clearInterval(interval);
//     } else if (timer === 0 && !answerSubmitted) {
//       handleAutoSubmit(); // Automatically submit when the timer runs out
//     }
//   }, [timer, answerSubmitted]);

//   const handleAutoSubmit = () => {
//     setanswerSubmitted(true); // Mark answer as submitted
//     if (socket && selectedanswer) {
//       socket.emit("submitanswer", selectedanswer); // Send the selected answer to the server
//     }

//     // Determine if the selected answer is correct
//     if (question.correctanswer === selectedanswer) {
//       setCorrectAnswer(selectedanswer); // Highlight the correct answer
//     } else {
//       setCorrectAnswer(question.correctanswer); // Show the correct answer
//     }
//     setTimeout(() => {
//       if (socket) {
//         socket.on("nextQuestion", (nextQuestionData) => {
//           setQuestion(nextQuestionData); // Update state with the next question
//         }); // Request the next question
//       }
//     }, 2000);
//   };

  

//   return (
//     <div>
      

      
      
//         <div>
//           {question ? (
//             <div id="quiz">
//               <h2>{question.text}</h2>
//               <p>Time remaining: {timer} seconds</p>
//               <ul id="answers">
//                 {question.answers.map((ans, index) => (
//                   <li key={index} className={`answer  ${
//                     answerSubmitted
//                       ? ans === correctanswer
//                         ? "correct"
//                         : ans === selectedanswer && ans !== correctanswer
//                         ? "incorrect"
//                         : ""
//                       : ""
//                   }`}>
//                     <button
//                     disabled={answerSubmitted}
//                     onClick={() => setselectedAnswer(ans)}
//                   >
//                     {ans}
//                   </button>
//                   </li>
//                 ))}
//               </ul>
              
//             </div>
//           ) : (
//             <p>Loading question...</p>
//           )}
//         </div>
      
//     </div>
//   );
// };












// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const QuizApp = () => {
//   const [socket, setSocket] = useState(null);
//   //const [studentName, setStudentName] = useState("");
//   const [question, setQuestion] = useState(null);
//   const [answer, setAnswer] = useState("");
//   //const [quizStarted, setQuizStarted] = useState(false);
//   const [nameSubmitted, setNameSubmitted] = useState(false); // New state for name submission confirmation

//   // Set up WebSocket connection
//   useEffect(() => {
//     const newSocket = io("http://localhost:3001"); // Connect to WebSocket server
//     setSocket(newSocket);

//     // Listen for questions from the server
//     newSocket.on("question", (questionData) => {
//       setQuestion(questionData); // Update state with the received question
//     });

//     // Listen for quiz completion message
//     newSocket.on("finished", (message) => {
//       alert(message); // Alert when the quiz is finished
//       //setQuizStarted(false); // Reset quiz started state
//       setQuestion(null); // Clear the question
//     });

//     // Clean up the socket connection when the component is unmounted
//     return () => {
//       if (newSocket) {
//         newSocket.off("question");
//         newSocket.off("finished");
//         newSocket.close();
//       }
//     };
//   }, []);

//   // Function to start the quiz
//   /*const handleStartQuiz = () => {

    
//     if (socket && studentName) {
//       socket.emit("message", studentName); // Send the student's name to the server
//       setQuizStarted(true);
//       setNameSubmitted(true); // Set the name as submitted when quiz starts
//     }
//   };*/

//   // Function to submit an answer
//   const handleSubmitAnswer = () => {
//     if (socket && answer) {
//       socket.emit("submitanswer", answer); // Send the answer to the server
//       setAnswer(""); // Clear the answer input

//       // Listen for the next question
//       socket.on("nextQuestion", (nextQuestionData) => {
//         setQuestion(nextQuestionData); // Update state with the next question
//       });
//     }
//   };

//   return (
//     <div>
//       <h1>Quiz App</h1>

//       {!quizStarted ? (
//         <div>
//           <h2>Enter your name to start the quiz</h2>
//           <input
//             type="text"
//             value={studentName}
//             onChange={(e) => setStudentName(e.target.value)}
//             placeholder="Your name"
//           />
//           <button onClick={handleStartQuiz}>Start Quiz</button>

//           {/* Show confirmation after submitting the name */}
//           {nameSubmitted && <p>Welcome, {studentName}!</p>}
//         </div>
//       ) : (
//         <div>
//           {question ? (
//             <div>
//               <h2>{question.text}</h2>
//               <ul>
//                 {question.answers.map((ans, index) => (
//                   <li key={index}>
//                     <button onClick={() => setAnswer(ans)}>{ans}</button>
//                   </li>
//                 ))}
//               </ul>
//               <button onClick={handleSubmitAnswer}>Submit Answer</button>
//             </div>
//           ) : (
//             <p>Loading question...</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizApp;





/*import React, { useState, useEffect } from "react";
import { io } from "socket.io-client"; // Import socket.io client library

const QuizApp = () => {
  const [socket, setSocket] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  // Set up WebSocket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001"); // Connect to WebSocket server
    setSocket(newSocket);

    // Clean up the socket connection when the component is unmounted
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  // Function to start the quiz
  const handleStartQuiz = () => {
    if (socket && studentName) {
      socket.emit("message", studentName); // Send the student's name to the server
      setQuizStarted(true);

      // Listen for questions from the server
      socket.on("question", (questionData) => {
        setQuestion(questionData); // Update state with the received question
      });

      // Listen for quiz completion message
      socket.on("finished", (message) => {
        alert(message); // Alert when the quiz is finished
        setQuizStarted(false); // Reset quiz started state
        setQuestion(null); // Clear the question
      });
    }
  };

  // Function to submit the answer
  const handleSubmitAnswer = () => {
    if (socket && answer) {
      socket.emit("message", answer); // Send the answer to the server
      setAnswer("");  // Clear the answer input

      // Listen for next question after the answer is submitted
      socket.on("nextQuestion", (nextQuestionData) => {
        setQuestion(nextQuestionData); // Update state with the next question
      });
    }
  };

  return (
    <div>
      <h1>Quiz App</h1>

      {!quizStarted ? (
        <div>
          <h2>Enter your name to start the quiz</h2>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Your name"
          />
          <button onClick={handleStartQuiz}>Start Quiz</button>
        </div>
      ) : (
        <div>
          {question ? (
            <div>
              <h2>{question.text}</h2>
              <ul>
                {question.answers.map((ans, index) => (
                  <li key={index}>
                    <button onClick={() => setAnswer(ans)}>{ans}</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleSubmitAnswer}>Submit Answer</button>
            </div>
          ) : (
            <p>Loading question...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizApp;

*/






/*import React, { useState, useEffect } from "react";
import { io } from "socket.io-client"; // Import the socket.io client library

const QuizApp = () => {
  const [socket, setSocket] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  // Setup WebSocket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001"); // Your server URL
    setSocket(newSocket);

    // Clean up socket on component unmount
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  const handleStartQuiz = () => {
    if (socket && studentName) {
      socket.emit("connectStudent", studentName); // Send the student name to the server
      setQuizStarted(true);
      socket.on("question", (questionData) => {
        setQuestion(questionData);
      });
    }
  };

  const handleSubmitAnswer = () => {
    if (socket && answer) {
      socket.emit("submitAnswer", answer); // Send the answer to the server
      setAnswer(""); // Clear the answer input
      socket.on("nextQuestion", (nextQuestionData) => {
        setQuestion(nextQuestionData);
      });
    }
  };

  return (
    <div>
      <h1>Quiz App</h1>

      {!quizStarted ? (
        <div>
          <h2>Enter your name to start the quiz</h2>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Your name"
          />
          <button onClick={handleStartQuiz}>Start Quiz</button>
        </div>
      ) : (
        <div>
          {question ? (
            <div>
              <h2>{question.text}</h2>
              <ul>
                {question.answers.map((ans, index) => (
                  <li key={index}>
                    <button onClick={() => setAnswer(ans)}>{ans}</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleSubmitAnswer}>Submit Answer</button>
            </div>
          ) : (
            <p>Loading question...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizApp;*/
