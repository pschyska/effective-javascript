import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

test("loads and displays greeting", async () => {
  const { getByTitle } = render(<App />);

  expect(getByTitle("count")).toHaveTextContent("0");
  fireEvent.click(screen.getByText("Click"));
  expect(getByTitle("count")).toHaveTextContent("1");
});
