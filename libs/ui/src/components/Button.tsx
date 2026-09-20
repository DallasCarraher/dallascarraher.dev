import React from "react";
import * as stylex from "@stylexjs/stylex";
import { styles } from "./Button.stylex";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  variant?: "primary" | "secondary";
  style?: stylex.StyleXStyles;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ style, variant = "primary", ...props }, ref) => {
    return <button ref={ref} {...stylex.props(styles.base, styles[variant], style)} {...props} />;
  },
);

Button.displayName = "Button";
