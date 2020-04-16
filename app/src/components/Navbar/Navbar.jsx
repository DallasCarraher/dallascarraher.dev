import React from "react";
import { Link } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import GitHubIcon from "@material-ui/icons/GitHub";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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
  github: {
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
    fontFamily: "Operator Mono",
    marginLeft: "1rem",
    flexGrow: 1,
  },
  NameLogo: {
    // flexBasis: 4,
  },
}));

export const Navbar = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h3" noWrap>
            🦦
          </Typography>
          <Typography variant="h5" noWrap className={classes.myName}>
            Dallas Carraher
          </Typography>
          <a
            href="https://github.com/dallascarraher"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.github}
          >
            <GitHubIcon />
          </a>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <Link to="/" className={classes.links}>
              <ListItem button key="Home">
                <ListItemIcon>
                  <HomeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
            <Link to="/resume" className={classes.links}>
              <ListItem button key="Resumé">
                <ListItemIcon>
                  <PictureAsPdfIcon />
                </ListItemIcon>
                <ListItemText primary="Resumé" />
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List></List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
};

export default Navbar;
