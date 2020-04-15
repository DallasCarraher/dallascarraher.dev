import React from "react";
import { Router } from "@reach/router";
import { Home, Resume } from "components";
import "./App.scss";

function App() {
  return (
    <Router>
      <Home path="/" />
      <Resume path="/resume" />
    </Router>
  );
}

export default App;
