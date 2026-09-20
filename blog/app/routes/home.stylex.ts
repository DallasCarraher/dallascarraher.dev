import { colors } from "@dallascarraher/ui/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

const SM = "@media (min-width: 640px)";
const MD = "@media (min-width: 768px)";

export const styles = stylex.create({
  page: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    paddingTop: "2rem",
    paddingBottom: "1.5rem",
    paddingInline: "1rem",
  },
  headerInner: {
    maxWidth: "640px",
    marginInline: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatarWrap: {
    width: { default: "10rem", [MD]: "14rem" },
    height: { default: "10rem", [MD]: "14rem" },
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    userSelect: "none",
    borderRadius: "9999px",
  },
  heading: {
    fontSize: { default: "1.5rem", [MD]: "1.875rem" },
    padding: "0.75rem",
    fontWeight: 700,
    color: colors.heading,
  },
  spotifySection: {
    display: "flex",
    flexDirection: "column",
    marginTop: { default: "1.5rem", [MD]: "2rem" },
    textAlign: "center",
    alignItems: "center",
    minHeight: "6.25rem",
    width: "100%",
    paddingInline: "1rem",
  },
  trackRow: {
    display: "flex",
    gap: "0.5rem",
  },
  albumArt: {
    height: "2.5rem",
    margin: 0,
    borderRadius: "0.25rem",
    borderColor: "#22c55e",
    borderWidth: "2px",
    borderStyle: "solid",
  },
  spotifyIcon: {
    height: "1.75rem",
    paddingRight: "0.75rem",
  },
  notPlayingIcon: {
    height: "1.5rem",
    opacity: 0.5,
  },
  trackInfo: {
    paddingTop: "0.5rem",
    paddingBottom: "0.25rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: colors.textSecondary,
    maxWidth: "100%",
  },
  trackName: {
    fontWeight: 500,
    fontSize: { default: "0.875rem", [MD]: "1rem" },
    paddingInline: "0.5rem",
    overflowWrap: "break-word",
    textAlign: "center",
  },
  progressBarWrap: {
    marginTop: "0.25rem",
    width: "100%",
    maxWidth: "20rem",
  },
  timestamp: {
    fontSize: "0.75rem",
    marginTop: "0.25rem",
  },
  notPlaying: {
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: { default: "0.875rem", [MD]: "1rem" },
  },
  main: {
    flexGrow: 1,
    maxWidth: "640px",
    paddingInline: "1.5rem",
    marginInline: "auto",
    width: "100%",
  },
  mainInner: {
    paddingBlock: { default: "2rem", [MD]: "3rem" },
  },
  mainPlaceholder: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: { default: "0.875rem", [MD]: "1rem" },
  },
  footer: {
    width: "100%",
    marginTop: "auto",
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: colors.border,
  },
  footerInner: {
    maxWidth: "640px",
    paddingInline: "1.5rem",
    marginInline: "auto",
    paddingBlock: { default: "1.5rem", [MD]: "2rem" },
    display: "flex",
    flexDirection: { default: "column", [SM]: "row" },
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
  copyright: {
    color: "#9ca3af",
    fontSize: { default: "0.75rem", [MD]: "0.875rem" },
  },
  socialRow: {
    display: "flex",
    gap: "0.75rem",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "2.25rem",
    width: "2.25rem",
    backgroundColor: { default: colors.iconBg, ":hover": colors.iconBgHover },
    borderRadius: "9999px",
    transitionProperty: "background-color",
    transitionDuration: "150ms",
  },
  socialIcon: {
    height: "1rem",
    width: "1rem",
    fill: colors.iconFill,
  },
});
