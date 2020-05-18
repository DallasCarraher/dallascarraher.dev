import React from "react";
import { Card, CardContent, Paper } from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import { useThemeState, themes } from "utils";
import { Navigation } from "../Navigation/Navigation";
import AboutMe from "./AboutMe/AboutMe";
import avatar from "img/avatar.png";
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
              <p style={{ textAlign: "center" }}>
                I'll probably put something here soon ...
              </p>
            </Paper>
          </div>
        </div>
      </Navigation>
    </div>
  );
}
