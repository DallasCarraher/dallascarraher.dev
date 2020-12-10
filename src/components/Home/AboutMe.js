import React from "react";
import "./aboutme.scss";

export default function AboutMe() {
  return (
    <div data-testid="posts" className="about-me">
      <h1>About Me</h1>
      <p>Experienced Front-end Software Engineer</p>
      <p>Skilled in: </p>
      <ul>
        <li> JavaScript, Typescript, React, React Native </li>
        <li> Node & express, GraphQL </li>
        <li> AWS (DynamoDB, RDS, EC2) & Google Cloud Platform equivalents.</li>
        <ul>
          <li>
            Firebase is also really cool <RocketEmoji />. I use it for most
            personal projects (including this site).
          </li>
        </ul>
      </ul>
      <p>I have a BS in Information Systems from Oregon State University.</p>
    </div>
  );
}

const RocketEmoji = () => (
  <span role="img" aria-label="rocket">
    🚀
  </span>
);
