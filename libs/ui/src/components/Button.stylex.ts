import * as stylex from "@stylexjs/stylex";

export const styles = stylex.create({
  base: {
    paddingBlock: "0.5rem",
    paddingInline: "1rem",
    borderRadius: "0.25rem",
    fontWeight: 500,
    transitionProperty: "background-color",
    transitionDuration: "150ms",
    border: "none",
    cursor: "pointer",
  },
  primary: {
    backgroundColor: { default: "#2563eb", ":hover": "#1d4ed8" },
    color: "#ffffff",
  },
  secondary: {
    backgroundColor: { default: "#e5e7eb", ":hover": "#d1d5db" },
    color: "#1f2937",
  },
});
