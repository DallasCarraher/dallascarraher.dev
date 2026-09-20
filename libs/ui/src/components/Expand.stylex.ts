import * as stylex from "@stylexjs/stylex";
import { colors } from "../styles/tokens.stylex";

export const styles = stylex.create({
  disclosure: {
    textDecoration: { default: "none", ":hover": "underline" },
    cursor: "pointer",
  },
  popover: {
    maxWidth: "min(calc(100vw - 16px), 320px)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    borderRadius: "0.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.popoverBorder,
    backgroundColor: colors.popoverBg,
    padding: "1rem",
    color: colors.heading,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  heading: {
    fontWeight: 500,
    fontSize: "1.25rem",
    marginBottom: "0.5rem",
  },
  actionButton: {
    marginTop: "1rem",
    width: "100%",
  },
});
