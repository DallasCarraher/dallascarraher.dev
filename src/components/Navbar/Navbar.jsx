import React from "react";
import { Link } from "@reach/router";
import {
  Drawer,
  AppBar,
  Button,
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
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import { useStyles } from "./useStyles";

export const Navbar = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Link to="/" className={classes.nameLogo}>
            <Button>
              <Typography variant="h3" noWrap>
                🦦
              </Typography>
              <Typography variant="h5" noWrap className={classes.myName}>
                Dallas Carraher
              </Typography>
            </Button>
          </Link>
          <a
            href="https://linkedin.com/in/dallascarraher/"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.socialLinks}
          >
            <LinkedInIcon fontSize="large" />
          </a>
          <a
            href="https://github.com/dallascarraher"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.socialLinks}
          >
            <GitHubIcon fontSize="large" />
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
