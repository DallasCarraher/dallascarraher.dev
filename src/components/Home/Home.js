import React from "react";
import { Card, CardContent, CardActions, Paper } from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import { Navbar } from "../Navbar/Navbar";
import AboutMe from "./AboutMe/AboutMe";
import avatar from "img/avatar.png";
import "./style.scss";

export default function Home() {
  const codeIcon = <CodeIcon fontSize="small" className="sm-icons" />;
  const companyIcon = <BusinessIcon fontSize="small" className="sm-icons" />;
  const locationIcon = <LocationOnIcon fontSize="small" className="sm-icons" />;

  return (
    <div>
      <Navbar>
        <div className="parent-div">
          <div data-testid="profile" className="profile-div">
            <Card>
              <CardContent>
                <img src={avatar} alt="Dallas Carraher" className="avatar" />
                <p> {codeIcon} Software Engineer</p>
                <p> {companyIcon} CDK Global</p>
                <p> {locationIcon} Portland, OR</p>
              </CardContent>
            </Card>
          </div>
          <div data-testid="content" className="content-div">
            <Paper className="content-div-paper">
              <AboutMe />
            </Paper>
            <Paper className="content-div-paper">
              <p style={{ textAlign: "center" }}>
                I'll probably put something here soon ...
              </p>
            </Paper>
          </div>
        </div>
      </Navbar>
    </div>
  );
}
