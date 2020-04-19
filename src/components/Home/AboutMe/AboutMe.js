import React from "react";
import "./style.scss";

export default function AboutMe() {
  return (
    <div data-testid="posts" className="about-me">
      <h2>About Me</h2>
      <p>
        Experienced Software Engineer with a demonstrated history of working in
        modern full stack environments.
      </p>
      <p>Skilled in: </p>
      <ul>
        <li> JavaScript, React, Redux </li>
        <li> Spring (Java), C# </li>
        <li> AWS (DynamoDB, EC2, Lambda, RDS) & GCP equivalents.</li>
      </ul>
      <p>
        Strong engineering professional with a Bachelor of Science focused in
        Business Information Systems from Oregon State University.
      </p>
    </div>
  );
}
