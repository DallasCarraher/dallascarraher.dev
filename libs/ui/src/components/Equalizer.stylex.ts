import * as stylex from "@stylexjs/stylex";
import { colors } from "../styles/tokens.stylex";

const goUpDown = stylex.keyframes({
  "0%": { height: "0px" },
  "100%": { height: "24px" },
});

const lineBase = {
  position: "relative",
  width: "4px",
  backgroundColor: colors.heading,
  animationName: goUpDown,
  animationIterationCount: "infinite",
  animationDirection: "alternate",
} as const;

export const styles = stylex.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "auto",
    margin: 0,
    paddingBottom: "2px",
    paddingLeft: "8px",
  },
  box: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "30px",
    height: "8px",
  },
  line1: { ...lineBase, height: "40px", animationDuration: "0.7s" },
  line2: { ...lineBase, height: "40px", animationDuration: "0.6s" },
  line3: { ...lineBase, height: "40px", animationDuration: "0.9s" },
  line4: { ...lineBase, height: "40px", animationDuration: "0.3s" },
  line5: { ...lineBase, height: "14px", animationDuration: "0.4s" },
});
