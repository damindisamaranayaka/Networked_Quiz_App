module.exports = [
  {
    id: "q1",
    text: "Which protocol is commonly used for real-time communication in network programming?",
    correctanswer: "UDP (User Datagram Protocol)",
    answers: [
      "UDP (User Datagram Protocol)",
      "TCP (Transmission Control Protocol)",
      "HTTP (HyperText Transfer Protocol)",
      "FTP (File Transfer Protocol)",
    ],
  },
  {
    id: "q2",
    text: "What is a key difference between UDP and TCP?",
    correctanswer:  "UDP is connectionless, while TCP is connection-oriented.",
    answers: [
      "UDP is connectionless, while TCP is connection-oriented.",
      "UDP guarantees reliable delivery, while TCP does not.",
      "TCP is faster than UDP because it does not require acknowledgment.",
      "UDP uses a three-way handshake for establishing connections.",
    ],
  },
  {
    id: "q3",
    text: "What is the role of sockets in network programming?",
    correctanswer: "Sockets enable communication between devices over a network.",
    answers: [
      "Sockets enable communication between devices over a network.",
      "Sockets are used to encrypt data for secure communication.",
      "Sockets are responsible for managing database connections.",
      "Sockets enable the compression of data during transmission.",
    ],
  },
   {
    id: "q4",
    text: "What does a thread represent in multi-threaded network programming?",
    correctanswer: "A thread represents a single path of execution within a program.",
    answers: [
      "A thread represents a single path of execution within a program.",
      "A thread represents the data being transmitted over a network.",
      "A thread represents a network protocol for communication.",
      "A thread represents a socket connection in the program.",
    ],
  },
  // {
  //   id: "q5",
  //   text: "What is one disadvantage of using UDP for communication?",
  //   answers: [
  //     "It does not guarantee the delivery of packets.",
  //     "It requires more bandwidth than TCP.",
  //     "It establishes a slower connection compared to TCP.",
  //     "It does not support encryption or security features.",
  //   ],
  // },
  // {
  //   id: "q6",
  //   text: "Which method in socket programming is used to bind a socket to a specific address and port?",
  //   answers: ["bind()", "connect()", "listen()", "accept()"],
  // },
  // {
  //   id: "q7",
  //   text: "Which of the following is NOT a typical use of threads in network programming?",
  //   answers: [
  //     "Handling multiple client connections simultaneously.",
  //     "Performing long-running computations in the background.",
  //     "Receiving and processing network packets concurrently.",
  //     "Encrypting network traffic for secure communication.",
  //   ],
  // },
  // {
  //   id: "q8",
  //   text: "What happens if a thread in a multi-threaded program crashes?",
  //   answers: [
  //     "The other threads may continue to run, depending on the program’s design.",
  //     "All threads will immediately stop executing.",
  //     "The entire program will shut down regardless of the other threads.",
  //     "The crashed thread will be automatically restarted by the system.",
  //   ],
  // },
  // {
  //   id: "q9",
  //   text: "Which port range is typically used by UDP for dynamic or private ports?",
  //   answers: ["49152-65535", "0-1023", "1024-49151", "20000-30000"],
  // },
  // {
  //   id: "q10",
  //   text: "Which of the following is a characteristic of a stateless protocol like UDP?",
  //   answers: [
  //     "It does not maintain any connection state between requests.",
  //     "It requires a handshake before transmitting data.",
  //     "It ensures data is delivered in the correct order.",
  //     "It provides automatic error correction during transmission.",
  //   ],
  // },
];
