import React from 'react'
import Button from '@material-ui/core/Button'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import { Navigation } from '../../common/Navigation/Navigation'
import resume from 'img/resume.png'
import pdf from './Resume.pdf'
import './style.scss'

export default function Resume() {
  return (
    <Navigation>
      <div className="resume">
        <div className="resume-left-container">
          <img src={resume} alt="resume.png" className="resume-img" />
        </div>
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
    </Navigation>
  )
}
