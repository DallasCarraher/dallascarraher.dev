import { colors } from "@dallascarraher/ui/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

export const styles = stylex.create({
  html: {
    height: "100%",
  },
  body: {
    height: "100%",
    backgroundColor: colors.bg,
    color: colors.text,
  },
  errorMain: {
    paddingTop: "4rem",
    padding: "1rem",
    maxWidth: "1280px",
    marginInline: "auto",
  },
  errorPre: {
    width: "100%",
    padding: "1rem",
    overflowX: "auto",
  },
});
