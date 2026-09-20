import * as stylex from "@stylexjs/stylex";
import { colors } from "../styles/tokens.stylex";

const pulse = stylex.keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.5 },
});

const dotBase = {
  position: "absolute",
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: colors.heading,
  animationName: pulse,
  animationDuration: "1.2s",
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
} as const;

export const styles = stylex.create({
  wrapper: {
    display: "inline-block",
    position: "relative",
    width: "80px",
    height: "80px",
  },
  dot1: { ...dotBase, top: "8px", left: "8px", animationDelay: "0s" },
  dot2: { ...dotBase, top: "8px", left: "32px", animationDelay: "-0.4s" },
  dot3: { ...dotBase, top: "8px", left: "56px", animationDelay: "-0.8s" },
  dot4: { ...dotBase, top: "32px", left: "8px", animationDelay: "-0.4s" },
  dot5: { ...dotBase, top: "32px", left: "32px", animationDelay: "-0.8s" },
  dot6: { ...dotBase, top: "32px", left: "56px", animationDelay: "-1.2s" },
  dot7: { ...dotBase, top: "56px", left: "8px", animationDelay: "-0.8s" },
  dot8: { ...dotBase, top: "56px", left: "32px", animationDelay: "-1.2s" },
  dot9: { ...dotBase, top: "56px", left: "56px", animationDelay: "-1.6s" },
});
