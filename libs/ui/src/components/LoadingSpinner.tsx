import * as stylex from "@stylexjs/stylex";
import { styles } from "./LoadingSpinner.stylex";

export const LoadingSpinner = () => (
  <div {...stylex.props(styles.wrapper)}>
    <div {...stylex.props(styles.dot1)}></div>
    <div {...stylex.props(styles.dot2)}></div>
    <div {...stylex.props(styles.dot3)}></div>
    <div {...stylex.props(styles.dot4)}></div>
    <div {...stylex.props(styles.dot5)}></div>
    <div {...stylex.props(styles.dot6)}></div>
    <div {...stylex.props(styles.dot7)}></div>
    <div {...stylex.props(styles.dot8)}></div>
    <div {...stylex.props(styles.dot9)}></div>
  </div>
);
