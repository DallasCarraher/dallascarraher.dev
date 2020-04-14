import React from "react";
import { render } from "@testing-library/react";
import Navbar from "./Navbar";

test("renders navbar", () => {
  const { getByText } = render(<Navbar />);
  const navbarHomeButton = getByText(/Home/i);
  const navbarResumeButton = getByText(/Resumé/i);
  expect(navbarHomeButton && navbarResumeButton).toBeInTheDocument();
});
