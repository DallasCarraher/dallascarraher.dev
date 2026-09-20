import type { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { styles } from "./AnchorTag.stylex";

export interface AnchorTagProps {
  href?: string;
  children: ReactNode;
  style?: stylex.StyleXStyles;
}

export const AnchorTag: FC<AnchorTagProps> = ({ children, href = "#", style }) => {
  return (
    <a href={href} {...stylex.props(styles.base, style)} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
};
