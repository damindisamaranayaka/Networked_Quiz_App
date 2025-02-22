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







/*const { parentPort, workerData } = require("worker_threads");

const { socketId, questions } = workerData;
let currentQuestionIndex = 0;

// Function to send the next question to the client
const sendNextQuestion = () => {
  if (currentQuestionIndex < questions.length) {
    parentPort.postMessage({
      type: "question",
      data: questions[currentQuestionIndex],
    });
    currentQuestionIndex++;
  } else {
    parentPort.postMessage({
      type: "finished",
      data: "You have completed the quiz!",
    });
  }
};

// Start sending questions
sendNextQuestion();

// Worker listens for any messages from the parent thread (main server)
parentPort.on("message", (message) => {
  if (message === "nextQuestion") {
    sendNextQuestion(); // Move to the next question when requested
  }
});
*/






/*const { parentPort, workerData } = require("worker_threads");
const net = require("net");

const { message } = workerData; // Get the message from the main thread

// Create TCP client connection
const tcpClient = net.createConnection({ port: 4000 }, () => {
  console.log("Connected to TCP server");

  // Send the message to the TCP server
  tcpClient.write(message);
});

// Listen for data from the TCP server
tcpClient.on("data", (data) => {
  console.log(`Received from TCP server: ${data}`);
  parentPort.postMessage(data.toString());  // Send response to the main thread (WebSocket server)
});

// Handle errors
tcpClient.on("error", (err) => {
  console.error(`TCP Error: ${err.message}`);
  parentPort.postMessage(`Error: ${err.message}`);
});

tcpClient.on("end", () => {
  console.log("Disconnected from TCP server");
});


*/




/*const { workerData, parentPort } = require("worker_threads");
const net = require("net");

// Dummy quiz data (replace with dynamic data if needed)
const quizQuestions = [
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is the square root of 16?", answer: "4" },
];

let currentQuestionIndex = 0;

// Create a socket for the passed file descriptor
const socket = new net.Socket({ fd: workerData.socketId });

// Send a welcome message to the client
socket.write("Welcome to the Quiz!\n");
sendNextQuestion();

// Handle incoming data (answers from the client)
socket.on("data", (data) => {
  const answer = data.toString().trim();
  const correctAnswer = quizQuestions[currentQuestionIndex].answer;

  if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
    socket.write("Correct!\n");
  } else {
    socket.write(`Wrong! Correct answer: ${correctAnswer}\n`);
  }

  currentQuestionIndex++;

  // Check if there are more questions
  if (currentQuestionIndex < quizQuestions.length) {
    sendNextQuestion();
  } else {
    socket.write("Quiz completed! Thank you for participating.\n");
    socket.end(); // Close the client connection
    parentPort.postMessage(`Quiz completed for client.`);
  }
});

// Handle client disconnection
socket.on("close", () => {
  parentPort.postMessage(`Connection closed for client.`);
});

// Handle errors on the socket
socket.on("error", (err) => {
  parentPort.postMessage(`Error: ${err.message}`);
});

// Function to send the next question
function sendNextQuestion() {
  const question = quizQuestions[currentQuestionIndex].question;
  socket.write(`Question: ${question}\n`);
}

*/



/*const { workerData, parentPort } = require("worker_threads");
const net = require("net");

// Dummy quiz data
const quizQuestions = [
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of France?", answer: "Paris" },
];

// Create a socket from the workerData
const socket = new net.Socket({ fd: workerData.socketId });

socket.write("Welcome to the Quiz!\n");

let currentQuestionIndex = 0;

// Send the first question
socket.write(`Question: ${quizQuestions[currentQuestionIndex].question}\n`);

// Handle incoming data (answers from the client)
socket.on("data", (data) => {
  const answer = data.toString().trim();
  const correctAnswer = quizQuestions[currentQuestionIndex].answer;

  if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
    socket.write("Correct!\n");
  } else {
    socket.write(`Wrong! Correct answer: ${correctAnswer}\n`);
  }

  currentQuestionIndex++;

  // Check if there are more questions
  if (currentQuestionIndex < quizQuestions.length) {
    socket.write(`Question: ${quizQuestions[currentQuestionIndex].question}\n`);
  } else {
    socket.write("Quiz completed! Thank you for participating.\n");
    socket.end(); // Close the client connection
    parentPort.postMessage("Client disconnected");
  }
});

// Handle client disconnection
socket.on("close", () => {
  parentPort.postMessage("Connection closed");
});*/
