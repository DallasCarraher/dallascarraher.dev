import React from "react";
import { render, within } from "@testing-library/react";
import AboutMe from "../AboutMe";

test("renders AboutMe Section", () => {
  const { getByTestId } = render(<AboutMe />);
  const { getByText } = within(getByTestId("posts"));
  const aboutMeHeader = getByText(/About Me/i);
  const aboutMeParagraph = getByText(/Experienced Software/i);
  expect(aboutMeHeader && aboutMeParagraph).toBeInTheDocument();
});
