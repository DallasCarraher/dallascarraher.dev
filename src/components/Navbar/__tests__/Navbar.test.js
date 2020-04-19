import React from "react";
import { render } from "@testing-library/react";
import Navbar from "../Navbar";

test("renders navbar", () => {
  const { getByText } = render(<Navbar />);
  const appBarTitle = getByText(/Dallas Carraher/i);
  const navbarHomeButton = getByText(/Home/i);
  const navbarResumeButton = getByText(/Resumé/i);
  expect(
    appBarTitle && navbarHomeButton && navbarResumeButton
  ).toBeInTheDocument();
});
