import React from "react";
import "./style.scss";

export default function AboutMe() {
  return (
    <div data-testid="posts" className="about-me">
      <h2>About Me</h2>
      <p>
        Experienced Software Engineer with a demonstrated history of working
        full stack
      </p>
      <p>Skilled in: </p>
      <ul>
        <li> JavaScript, Typescript, React, React Native, Redux </li>
        <li> Java (Spring), Node (express) </li>
        <li> AWS (DynamoDB, RDS, EC2) & Google Cloud Platform equivalents.</li>
        <li>
          I really enjoy firebase. I use that for most personal projects
          (including this site).
        </li>
      </ul>
      <p>
        I'm a Strong engineering professional with a Bachelor of Science focused
        in Business Information Systems from Oregon State University.
      </p>
    </div>
  );
}
