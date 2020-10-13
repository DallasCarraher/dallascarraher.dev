import React from "react";
import { Link } from "@reach/router";
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
  document.title = "Dallas Carraher";
  const codeIcon = <CodeIcon fontSize="small" className="sm-icons" />;
  const companyIcon = <BusinessIcon fontSize="small" className="sm-icons" />;
  const locationIcon = <LocationOnIcon fontSize="small" className="sm-icons" />;

  const { theme } = useThemeState();

  return (
      <Navigation>
        <div className="parent-div">
          <div data-testid="profile" className="profile-div">
            <Card className={theme === LIGHT ? "card-light" : "card-dark"}>
              <CardContent>
                <img src={avatar} alt="Dallas Carraher" className="avatar" />
                <p> {codeIcon} Front-end Engineer</p>
                <p> {companyIcon} CDK Global</p>
                <p> {locationIcon} Hillsboro, OR</p>
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
                • {" "}
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
                  markdown <span role="img" aria-label="hand-writing">✍️</span>
                </a>
              </p>
              <p style={{ textAlign: "left", fontSize: "16px" }}>
                • Learning a lot from{" "}
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
                  Epic React <span role="img" aria-label="atom">⚛️</span>
                </a>
              </p>
              <p style={{ textAlign: "left", fontSize: "16px" }}>
                • Working on my <Link to="blog" style={{textDecoration: 'none', color: 'black', fontWeight: 'bold'}}>Blog</Link>
              </p>
            </Paper>
          </div>
        </div>
      </Navigation>
  );
}
