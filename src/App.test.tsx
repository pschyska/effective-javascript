import "@testing-library/jest-dom/extend-expect";
import {
  act,
  fireEvent,
  render,
  RenderResult,
  screen,
} from "@testing-library/react";
import App from "./App";
import * as Sl from "@effect-ts/core/Sync/Layer";
import * as As from "@effect-ts/core/Async";
import { Github } from "./effects/github";
import { FetchError, Http, DecodeError } from "./effects/http";

test("loads and displays a GitHub zen", async () => {
  let c = 0;
  const succeedLayer = Sl.fromValue(Github)({
    getZen: () => As.succeed(`testzen${c++}`),
  });
  const { findByText } = render(<App layer={succeedLayer} />);

  expect(await findByText("testzen0")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Get new zen"));
  expect(await findByText("testzen1")).toBeInTheDocument();
});

test("fetch error", async () => {
  const failFetchLayer = Sl.fromValue(Github)({
    getZen: () => As.fail(new FetchError("fetch error")),
  });
  const { findByTitle } = render(<App layer={failFetchLayer} />);

  expect(await findByTitle("error")).toHaveTextContent("fetch error");
  fireEvent.click(screen.getByText("Get new zen"));
  expect(await findByTitle("error")).toHaveTextContent("fetch error");
});

test("decode error", async () => {
  const failDecodeLayer = Sl.fromValue(Github)({
    getZen: () => As.fail(new DecodeError("decode error")),
  });
  const { findByTitle } = render(<App layer={failDecodeLayer} />);

  expect(await findByTitle("error")).toHaveTextContent("decode error");
  fireEvent.click(screen.getByText("Get new zen"));
  expect(await findByTitle("error")).toHaveTextContent("decode error");
});
