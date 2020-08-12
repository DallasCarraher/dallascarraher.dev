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
        <li> Java (Spring) </li>
        <li>
          {" "}
          AWS (DynamoDB, EC2, Lambda, RDS) & Google Cloud Platform equivalents.
        </li>
      </ul>
      <p>
        Strong engineering professional with a Bachelor of Science focused in
        Business Information Systems from Oregon State University.
      </p>
    </div>
  );
}
