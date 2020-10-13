import React, { useState } from "react";
import { Link } from "@reach/router";

import clsx from "clsx";
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
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import WebIcon from '@material-ui/icons/Web';
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";

import { useMobileStyles } from "./useMobileStyles";
import { useThemeContext, themes } from "utils";

const { LIGHT, DARK } = themes;

export const MobileNavbar = ({ children }) => {
  const [themeContext, dispatch] = useThemeContext();
  const { theme } = themeContext;

  const toggleTheme = () =>
    theme === LIGHT ? dispatch({ value: DARK }) : dispatch({ value: LIGHT });

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const styles = useMobileStyles(theme);
  const classes = styles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" className={classes.nameLogo}>
            <Button>
              <Typography variant="h4" noWrap>
                <span role="img" aria-label="rocket">🚀</span>
              </Typography>
              <Typography variant="h6" noWrap className={classes.myName}>
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
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
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
          <Link to="/blog" className={classes.links}>
              <ListItem button key="Blog">
                <ListItemIcon>
                  <WebIcon className={classes.icons} />
                </ListItemIcon>
                <ListItemText primary="Blog" />
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
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
};
