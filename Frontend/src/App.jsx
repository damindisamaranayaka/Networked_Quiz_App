/*import React from 'react';
import QuizApp from './Quizapp.jsx'; // Adjust the path based on where you placed the file

const App = () => {
  return (
    <div className="App">
      <QuizApp />
    </div>
  );
};

export default App;*/




import { useState } from "react";
import TimerChallenge from "./components/TimerChallenge.jsx";
import User from "./components/User.jsx";

function App() {
  const [enteredStudentName, setEnteredStudentName] = useState(null);
  return (
    <>
      {enteredStudentName === null ? (
        <User onNameSubmit={setEnteredStudentName} />
      ) : (
        <div id="challenges">
          <h1>Welcome {enteredStudentName}!</h1>
          <TimerChallenge title="Quiz 1" targetTime={13} />
        </div>
      )}
    </>
  );
}

export default App;
