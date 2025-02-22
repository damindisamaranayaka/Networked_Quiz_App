import { useRef } from "react";

export default function User({ onNameSubmit }) {
  const studentName = useRef();

  function handleClick() {
    const name = studentName.current.value.trim();
    if (name) {
      onNameSubmit(name); // Update the name in the App component
      studentName.current.value = ""; // Clear input
    }
  }

  return (
    <section id="player">
      <h2>Welcome Student</h2>
      <p>
        <input ref={studentName} type="text" placeholder="Enter your name" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
