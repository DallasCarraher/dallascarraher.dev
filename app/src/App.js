import React from "react";
import logo from "./logo.svg";
import avatar from "./img/avatar.png";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={avatar} className="avatar" alt="Dallas" />
        <p>
          <code>This was built using an IDE in the browser :)</code>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
