import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  bg: "var(--color-bg)",
  text: "var(--color-text)",
  heading: "var(--color-heading)",
  textSecondary: "var(--color-text-secondary)",
  border: "var(--color-border)",
  popoverBg: "var(--color-popover-bg)",
  popoverBorder: "var(--color-popover-border)",
  iconBg: "var(--color-icon-bg)",
  iconBgHover: "var(--color-icon-bg-hover)",
  iconFill: "var(--color-icon-fill)",
  brandPrimary: "#10b981",
  brandSecondary: "#3b82f6",
});

export const fonts = stylex.defineVars({
  sans: '"Wotfard", "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
});
