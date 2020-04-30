import React from "react";
import { Router } from "@reach/router";
import { Home, Resume } from "components";

function App() {
  document.title = "dallascarraher.dev";
  return (
    <Router>
      <Home path="/" />
      <Resume path="/resume" />
    </Router>
  );
}

export default App;
