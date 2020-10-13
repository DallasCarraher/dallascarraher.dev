import React from "react";
import { render, within } from "@testing-library/react";
import { ThemeProvider } from "utils";
import Home from "../Home";

test("renders Home Tab Profile Card Content", () => {
  const { getByTestId } = render(
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
  const { getByText } = within(getByTestId("profile"));
  const profilePositionElement = getByText(/Engineer/i);
  const profileCompanyElement = getByText(/CDK Global/i);
  const profileLocationElement = getByText(/OR/i);
  expect(
    profilePositionElement && profileCompanyElement && profileLocationElement
  ).toBeInTheDocument();
});
