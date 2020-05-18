import React from "react";
import { Link } from "@reach/router";

import {
  AppBar,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import IconButton from "@material-ui/core/IconButton";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";

import { useThemeContext, themes, useCheckForMobile } from "utils";
import { useStyles } from "./useStyles";
import { MobileNavbar } from "./MobileNavbar";

const { LIGHT, DARK } = themes;

export const Navigation = ({ children }) => {
  const width = useCheckForMobile();
  const [themeContext, dispatch] = useThemeContext();
  const { theme } = themeContext;

  const toggleTheme = () =>
    theme === LIGHT ? dispatch({ value: DARK }) : dispatch({ value: LIGHT });

  const styles = useStyles(theme);
  const classes = styles();

  return width < 700 ? (
    <MobileNavbar children={children} theme={theme} />
  ) : (
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
          <IconButton
            aria-label="toggle light/dark mode"
            component="span"
            className={classes.modeToggleButton}
            onClick={toggleTheme}
          >
            {theme === LIGHT ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
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
                  <HomeRoundedIcon className={classes.icons} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
            <Link to="/resume" className={classes.links}>
              <ListItem button key="Resumé">
                <ListItemIcon>
                  <PictureAsPdfIcon className={classes.icons} />
                </ListItemIcon>
                <ListItemText primary="Resumé" />
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            <a
              href="https://linkedin.com/in/dallascarraher/"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.links}
            >
              <ListItem button key="linkedIn">
                <ListItemIcon>
                  <LinkedInIcon className={classes.icons} />
                </ListItemIcon>
                <ListItemText primary="LinkedIn" />
              </ListItem>
            </a>
            <a
              href="https://github.com/dallascarraher"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.links}
            >
              <ListItem button key="linkedIn">
                <ListItemIcon>
                  <GitHubIcon className={classes.icons} />
                </ListItemIcon>
                <ListItemText primary="Github" />
              </ListItem>
            </a>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
};

export default Navigation;
