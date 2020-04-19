import React from "react";
import { render, within } from "@testing-library/react";
import Home from "../Home";

test("renders Home Tab Profile Card Content", () => {
  const { getByTestId } = render(<Home />);
  const { getByText } = within(getByTestId("profile"));
  const profilePositionElement = getByText(/Software Engineer/i);
  const profileCompanyElement = getByText(/CDK Global/i);
  const profileLocationElement = getByText(/Portland, OR/i);
  expect(
    profilePositionElement && profileCompanyElement && profileLocationElement
  ).toBeInTheDocument();
});
