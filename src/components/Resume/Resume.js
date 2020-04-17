import React from "react";
import Button from "@material-ui/core/Button";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Navbar } from "../Navbar/Navbar";
import resume from "img/resume.png";
import pdf from "./Resume.pdf";
import "./style.scss";

export default function Resume() {
  return (
    <Navbar>
      <div className="resume">
        <img src={resume} alt="resume.png" className="resume-img" />
        <div className="resume-right-container">
          <Button
            startIcon={<CloudDownloadIcon />}
            variant="contained"
            disableElevation
            href={pdf}
            target="_blank"
            className="resume-download-button"
          >
            Download A Copy
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
