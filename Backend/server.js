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
// Array of questions (This will be shared between workers and server)
const questions = require("./questions.js"); // Import the questions from questions.js

// Store active clients and their workers
const clients = new Map();

// When a new WebSocket connection is made
io.on("connection", (socket) => {
  console.log(`WebSocket client connected with socket ID: ${socket.id}`);

  // Start quiz for the connected client
  const startQuizForClient = () => {
    // Create a new worker thread for each client
    const worker = new Worker("./worker.js", {
      workerData: { socketId: socket.id, questions },
    });

    worker.on("message", (message) => {
      if (message.type === "question") {
        socket.emit("question", message.data); // Send the question to the client
      } else if (message.type === "finished") {
        console.log("Quiz finished for client", socket.id);
        socket.emit("finished", message.data); // Notify client that quiz is finished
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
      
      // After receiving an answer, trigger the worker to send the next question
      //worker.postMessage("nextQuestion");
      worker.postMessage({ type: "submitanswer", answer });
    });
    

    socket.on("correctanswer", (answer) => {
      console.log(`the correct answer is ${socket.id}: ${answer}`);
      
      // After receiving an answer, trigger the worker to send the next question
      //worker.postMessage("nextQuestion");
    });
    // Store the worker to handle cleanup later
    clients.set(socket.id, worker);

    // Clean up when the client disconnects
    socket.on("disconnect", () => {
      console.log(`Client disconnected with socket ID: ${socket.id}`);
      worker.terminate(); // Stop the worker for the client
      clients.delete(socket.id); // Remove the client from the map
    });
  };

  // Start the quiz when the client connects
  startQuizForClient();
});

// Start the server on port 3001
server.listen(3001, () => {
  console.log("Server is running on port 3001");
});






/*const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Worker } = require("worker_threads");
const net = require("net");
const cors = require("cors");

const app = express();

// Allow CORS for both Express and Socket.IO
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

const TCP_PORT = 4000;
const HTTP_PORT = 3001;
const clients = new Map();

const tcpServer = net.createServer((socket) => {
  let clientId = null;

  socket.on("data", (data) => {
    const studentName = data.toString().trim();

    if (!studentName || studentName.length === 0) {
      console.error("Invalid student name received. Connection ignored.");
      socket.end();
      return;
    }

    if (!clientId) {
      clientId = studentName;
      clients.set(clientId, socket);
      console.log(`New TCP client connected: ${clientId}`);

      try {
        const worker = new Worker("./worker.js", {
          workerData: { socketId: socket._handle.fd },
        });

        worker.on("message", (message) =>
          console.log(`Worker says: ${message}`)
        );
        worker.on("error", (err) =>
          console.error(`Worker error: ${err.message}`)
        );
        worker.on("exit", (code) =>
          console.log(`Worker exited with code ${code}`)
        );
      } catch (error) {
        console.error(`Failed to create worker: ${error.message}`);
        socket.end();
      }
    }
  });

  socket.on("end", () => {
    if (clientId) {
      clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    }
  });
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server running on port ${TCP_PORT}`);
});

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("connectStudent", (studentName) => {
    console.log(`Student connected: ${studentName}`);
    socket.emit("question", { text: "What is 2 + 2?", answers: ["3", "4", "5"] });
  });

  socket.on("submitAnswer", (answer) => {
    console.log(`Answer received: ${answer}`);
    socket.emit("nextQuestion", { text: "What is the capital of France?", answers: ["Berlin", "Paris", "Madrid"] });
  });

  socket.on("disconnect", () => {
    console.log("WebSocket connection closed");
  });
});

server.listen(HTTP_PORT, () => {
  console.log(`Express server running on port ${HTTP_PORT}`);
});*/



/*const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Worker } = require("worker_threads");
const net = require("net");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow this origin to make requests
  methods: ['GET', 'POST'],       // Allow GET and POST methods
  allowedHeaders: ['Content-Type'],  // Allow Content-Type header
}));

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());


const TCP_PORT = 4000;
const HTTP_PORT = 3001;
const clients = new Map();

const tcpServer = net.createServer((socket) => {
  let clientId = null;

  socket.on("data", (data) => {
    const studentName = data.toString().trim();

    // Validate the student name
    if (!studentName || studentName.length === 0) {
      console.error("Invalid student name received. Connection ignored.");
      socket.end(); // Close the connection if invalid data is received
      return;
    }

    if (!clientId) {
      clientId = studentName;
      clients.set(clientId, socket);
      console.log(`New TCP client connected: ${clientId}`);

      try {
        // Create a worker thread
        const worker = new Worker("./worker.js", {
          workerData: { socketId: socket._handle.fd },
        });

        // Handle worker events
        worker.on("message", (message) =>
          console.log(`Worker says: ${message}`)
        );
        worker.on("error", (err) =>
          console.error(`Worker error: ${err.message}`)
        );
        worker.on("exit", (code) =>
          console.log(`Worker exited with code ${code}`)
        );
      } catch (error) {
        console.error(`Failed to create worker: ${error.message}`);
        socket.end(); // Close the socket if worker creation fails
      }
    }
  });

  socket.on("end", () => {
    if (clientId) {
      clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    }
  });
});


tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server running on port ${TCP_PORT}`);
});

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("connectStudent", (studentName) => {
    // Register the student name with the WebSocket connection
    console.log(`Student connected: ${studentName}`);
    socket.emit("question", { text: "What is 2 + 2?", answers: ["3", "4", "5"] });
  });

  socket.on("submitAnswer", (answer) => {
    console.log(`Answer received: ${answer}`);
    // Handle the logic for validating the answer and send the next question
    socket.emit("nextQuestion", { text: "What is the capital of France?", answers: ["Berlin", "Paris", "Madrid"] });
  });

  socket.on("disconnect", () => {
    console.log("WebSocket connection closed");
  });
});

// Start Express server

server.listen(HTTP_PORT, () => {
  console.log(`Express server running on port ${HTTP_PORT}`);
});*/







/*const express = require("express");
const { Worker } = require("worker_threads"); // Import Worker class
const net = require("net");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const TCP_PORT = 4000;
const HTTP_PORT = 3001;

// Dummy storage for active TCP clients
const clients = new Map();

// TCP Server
const tcpServer = net.createServer((socket) => {
  const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
  clients.set(clientId, socket);
  console.log(`New TCP client connected: ${clientId}`);

  // Create a worker thread for this client
  const worker = new Worker("./worker.js", {
    workerData: {
      socketId: socket._handle.fd, // Pass the socket file descriptor to the worker
    },
  });

  // Handle messages from the worker
  worker.on("message", (message) => {
    console.log(`Worker for ${clientId} says:`, message);
  });

  worker.on("error", (err) => {
    console.error(`Worker error for ${clientId}:`, err);
  });

  worker.on("exit", (code) => {
    console.log(`Worker for ${clientId} exited with code ${code}`);
  });

  socket.on("end", () => {
    clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  });
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server running on port ${TCP_PORT}`);
});

// Express API


app.post("/start-quiz", (req, res) => {
    const { clientId, question } = req.body;
    const client = clients.get(clientId);
  
    if (client) {
      client.write(question);
      res.status(200).json({ question: { text: "What is 2 + 2?", answers: ["3", "4", "5"] } });
    } else {
      res.status(404).json({ error: "Client not connected." });
    }
  });
  
  app.post("/submit-answer", (req, res) => {
    const { answer } = req.body;
  
    // Simulate backend logic to validate the answer
    const nextQuestion = { text: "What is the capital of France?", answers: ["Berlin", "Paris", "Madrid"] };
    res.status(200).json({ nextQuestion });
  });
  

// Start Express server
app.listen(HTTP_PORT, () => {
  console.log(`Express server running on port ${HTTP_PORT}`);
});

*/





/*const express = require("express");
const { Worker } = require("worker_threads");
const net = require("net");

const app = express();
app.use(express.json());

const TCP_PORT = 4000;
const HTTP_PORT = 3001;

// Dummy storage for TCP socket workers (to simulate connections)
const clients = new Map();

// TCP Server
const tcpServer = net.createServer((socket) => {
  const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
  clients.set(clientId, socket);
  console.log(`New TCP client connected: ${clientId}`);

  socket.on("data", (data) => {
    console.log(`Message from ${clientId}:`, data.toString());
  });

  socket.on("end", () => {
    clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  });
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server running on port ${TCP_PORT}`);
});

// Express API
app.post("/start-quiz", (req, res) => {
  const { clientId, question } = req.body;

  const client = clients.get(clientId);
  if (client) {
    client.write(question);
    res.status(200).json({ message: "Question sent to TCP client." });
  } else {
    res.status(404).json({ error: "Client not connected." });
  }
});

app.post("/start-quiz", (req, res) => {
  const { clientId, question } = req.body;

  const client = clients.get(clientId);
  if (client) {
    client.write(question);
    res.status(200).json({ message: "Question sent to TCP client." });
  } else {
    res.status(404).json({ error: "Client not connected." });
  }
});

// Start Express server
app.listen(HTTP_PORT, () => {
  console.log(`Express server running on port ${HTTP_PORT}`);
});*/
