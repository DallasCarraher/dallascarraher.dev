import React, { createContext, useReducer, useContext } from "react";

const ThemeContext = createContext();
const ThemeDispatch = createContext();

const themes = {
  LIGHT: "light",
  DARK: "dark",
};

const { LIGHT, DARK } = themes;
const savedTheme = { theme: localStorage.getItem("theme") || LIGHT };

function themeReducer(state, theme) {
  switch (theme.value) {
    case LIGHT: {
      localStorage.setItem("theme", LIGHT);
      return { theme: LIGHT };
    }
    case DARK: {
      localStorage.setItem("theme", DARK);
      return { theme: DARK };
    }
    default: {
      throw new Error(`unhandled theme action: ${theme.value}`);
    }
  }
}

function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, savedTheme);
  return (
    <ThemeContext.Provider value={state}>
      <ThemeDispatch.Provider value={dispatch}>
        {children}
      </ThemeDispatch.Provider>
    </ThemeContext.Provider>
  );
}

function useThemeState() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeState must be used within a themeProvider");
  }
  return context;
}

function useThemeDispatch() {
  const context = useContext(ThemeDispatch);
  if (context === undefined) {
    throw new Error("useThemeDispatch must be used within a themeProvider");
  }
  return context;
}

// hook that combines the above 2 hooks for simplicity when wanting to use both
function useThemeContext() {
  return [useThemeState(), useThemeDispatch()];
}

export {
  ThemeProvider,
  useThemeState,
  useThemeDispatch,
  useThemeContext,
  themes,
};
