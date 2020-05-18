import React from "react";
import { Router } from "@reach/router";
import { ThemeProvider } from "utils";
import { Home, Resume } from "components";

function App() {
  document.title = "dallascarraher.dev";
  return (
    <ThemeProvider>
      <Router>
        <Home path="/" />
        <Resume path="/resume" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
