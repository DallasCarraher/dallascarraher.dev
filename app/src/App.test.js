import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders app and navbar", () => {
  const { getByText } = render(<App />);
  const navbarTitle = getByText(/Dallas Carraher/i);
  expect(navbarTitle).toBeInTheDocument();
});
