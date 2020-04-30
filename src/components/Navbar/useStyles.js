import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#074DCF",
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  socialLinks: {
    marginRight: "1rem",
    textDecoration: "none",
    color: "white",
    "&:hover": { color: "black" },
  },
  links: {
    textDecoration: "none",
    color: "gray",
    "&:hover": { color: "black" },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  myName: {
    textTransform: "none",
    fontFamily: "Operator Mono",
    color: "white",
    marginBottom: "0.5rem",
    marginLeft: "1rem",
    flexGrow: 1,
  },
  nameLogo: {
    textDecoration: "none",
    marginLeft: "1rem",
    flexGrow: 1,
  },
}));

export default useStyles;
