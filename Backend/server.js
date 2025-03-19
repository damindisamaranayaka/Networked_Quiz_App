const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Worker } = require("worker_threads");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const questions = require("./questions.js"); 


const clients = new Map();


io.on("connection", (socket) => {
  console.log(`WebSocket client connected with socket ID: ${socket.id}`);


  const startQuizForClient = () => {

    const worker = new Worker("./worker.js", {
      workerData: { socketId: socket.id, questions },
    });

    worker.on("message", (message) => {
      if (message.type === "question") {
        socket.emit("question", message.data);
      } else if (message.type === "finished") {
        console.log("Quiz finished for client", socket.id);
        socket.emit("finished", message.data); 
      }
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });

    socket.on("submitanswer", (answer) => {
      console.log(`Received answer from ${socket.id}: ${answer}`);
      

      worker.postMessage({ type: "submitanswer", answer });
    });
    

    socket.on("correctanswer", (answer) => {
      console.log(`the correct answer is ${socket.id}: ${answer}`);

    });

    clients.set(socket.id, worker);

  
    socket.on("disconnect", () => {
      console.log(`Client disconnected with socket ID: ${socket.id}`);
      worker.terminate(); 
      clients.delete(socket.id); 
    });
  };

  
  startQuizForClient();
});


server.listen(3001, () => {
  console.log("Server is running on port 3001");
});





