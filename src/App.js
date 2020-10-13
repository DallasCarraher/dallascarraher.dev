import React from "react";
import { Router } from "@reach/router";
import { ThemeProvider } from "utils";
import { Home, Resume, Blog } from "components";

function App() {
  document.title = "Dallas Carraher";
  return (
    <ThemeProvider>
      <Router>
        <Home path="/" />
        <Resume path="/resume" />
        <Blog path="/blog" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
