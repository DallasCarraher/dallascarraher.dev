import React from "react";
import { Card, CardContent, Paper } from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import { useThemeState, themes } from "utils";
import { Navigation } from "../Navigation/Navigation";
import AboutMe from "./AboutMe/AboutMe";
import avatar from "img/avatar.jpg";
import "./style.scss";

const { LIGHT } = themes;

export default function Home() {
  const codeIcon = <CodeIcon fontSize="small" className="sm-icons" />;
  const companyIcon = <BusinessIcon fontSize="small" className="sm-icons" />;
  const locationIcon = <LocationOnIcon fontSize="small" className="sm-icons" />;

  const { theme } = useThemeState();

  return (
    <div>
      <Navigation>
        <div className="parent-div">
          <div data-testid="profile" className="profile-div">
            <Card className={theme === LIGHT ? "card-light" : "card-dark"}>
              <CardContent>
                <img src={avatar} alt="Dallas Carraher" className="avatar" />
                <p> {codeIcon} Software Engineer</p>
                <p> {companyIcon} CDK Global</p>
                <p> {locationIcon} Portland, OR</p>
              </CardContent>
            </Card>
          </div>
          <div data-testid="content" className="content-div">
            <Paper className={theme === LIGHT ? "paper-light" : "paper-dark"}>
              <AboutMe />
            </Paper>
            <Paper className={theme === LIGHT ? "paper-light" : "paper-dark"}>
              <h2>
                What I've been up to...{" "}
                <span role="img" aria-label="thinking-face">
                  🤔
                </span>
              </h2>
              <p style={{ textAlign: "left", fontSize: "16px" }}>
                • Outside of work I've been working on a personal project using{" "}
                <a
                  href="https://vuejs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: "bold",
                    textDecoration: "none",
                    color: theme === LIGHT ? "black" : "white",
                  }}
                >
                  Vue
                </a>{" "}
                for the first time. I'm creating a markdown editor for myself
                and friends. Feel free to create an account and login to try it
                yourself.
                <a
                  href="https://dallascarraher.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: "bold",
                    textDecoration: "none",
                    color: theme === LIGHT ? "black" : "white",
                  }}
                >
                  {" "}
                  Click here to check it out
                </a>
              </p>
              <p style={{ textAlign: "left", fontSize: "16px" }}>
                • I also just purchased Kent Dodd's new workshop package{" "}
                <a
                  href="https://epicreact.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: "bold",
                    textDecoration: "none",
                    color: theme === LIGHT ? "black" : "white",
                  }}
                >
                  {" "}
                  Epic React
                </a>
              </p>
            </Paper>
          </div>
        </div>
      </Navigation>
    </div>
  );
}
