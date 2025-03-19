

const { parentPort, workerData } = require("worker_threads");

const { socketId, questions } = workerData;
let currentQuestionIndex = 0;
correctcount =0;
let totalquestions = questions.length;

const sendNextQuestion = () => {
  if (currentQuestionIndex < questions.length) {
    parentPort.postMessage({
      type: "question",
      socketId: socketId,  
      data: questions[currentQuestionIndex],
    });
    currentQuestionIndex++;
  } else {
    parentPort.postMessage({
      type: "finished",
      socketId: socketId, 
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


sendNextQuestion();


parentPort.on("message", (message) => {
  if (message.type === "submitanswer") {
    const submittedAnswer = message.answer;
    const correctAnswer = questions[currentQuestionIndex - 1]?.correctanswer;

    if (submittedAnswer === correctAnswer) {
      correctcount++;
    }
    sendNextQuestion(); 
  }
});


parentPort.on("error", (err) => {
  console.error("Worker error:", err);
});


parentPort.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Worker stopped with exit code ${code}`);
  }
});





