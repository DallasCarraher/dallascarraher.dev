import * as stylex from "@stylexjs/stylex";
import { styles } from "./Equalizer.stylex";

export const Equalizer = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.box)}>
        <div {...stylex.props(styles.line1)}></div>
        <div {...stylex.props(styles.line2)}></div>
        <div {...stylex.props(styles.line3)}></div>
        <div {...stylex.props(styles.line4)}></div>
        <div {...stylex.props(styles.line5)}></div>
      </div>
    </div>
  );
};
