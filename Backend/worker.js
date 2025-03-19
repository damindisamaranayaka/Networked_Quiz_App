// worker.js

const { parentPort, workerData } = require("worker_threads");

const { socketId, questions } = workerData;
let currentQuestionIndex = 0;
correctcount =0;
let totalquestions = questions.length;

// Function to send the next question to the client
const sendNextQuestion = () => {
  if (currentQuestionIndex < questions.length) {
    parentPort.postMessage({
      type: "question",
      socketId: socketId,  // Ensure the correct socket is referenced
      data: questions[currentQuestionIndex],
    });
    currentQuestionIndex++;
  } else {
    parentPort.postMessage({
      type: "finished",
      socketId: socketId,  // Ensure the correct socket is referenced
      data: {
        message: "Quiz finished!",
        summary: {
          totalquestions,
          correctAnswers: correctcount,
        },
      },
    });
  }
};

// Start sending the first question
sendNextQuestion();

// Worker listens for any messages from the parent thread (main server)
parentPort.on("message", (message) => {
  if (message.type === "submitanswer") {
    const submittedAnswer = message.answer;
    const correctAnswer = questions[currentQuestionIndex - 1]?.correctanswer;

    if (submittedAnswer === correctAnswer) {
      correctcount++;
    }
    sendNextQuestion(); // Move to the next question when requested
  }
});

// Optionally, handle errors gracefully
parentPort.on("error", (err) => {
  console.error("Worker error:", err);
});

// Gracefully handle worker termination
parentPort.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Worker stopped with exit code ${code}`);
  }
});





