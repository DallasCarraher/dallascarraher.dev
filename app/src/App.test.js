import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders appBar Title", () => {
  const { getByText } = render(<App />);
  const appBarTitle = getByText(/Dallas Carraher/i);
  expect(appBarTitle).toBeInTheDocument();
});
