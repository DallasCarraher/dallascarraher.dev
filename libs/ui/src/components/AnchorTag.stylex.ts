import * as stylex from "@stylexjs/stylex";

export const styles = stylex.create({
  base: {
    color: "#3b82f6",
    transitionProperty: "color",
    transitionDuration: "150ms",
    textDecoration: { default: "none", ":hover": "underline" },
  },
});
