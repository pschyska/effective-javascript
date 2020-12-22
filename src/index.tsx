import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as As from "@effect-ts/core/Async";
import { runAsync, matchTag } from "@effect-ts/core/Async";
import { pipe } from "@effect-ts/core/Function";
import { isAdtElement, isTag, onAdtElement } from "@effect-ts/core/Utils";
import * as Ex from "@effect-ts/core/Effect/Exit";
import { assertsFailure } from "@effect-ts/core/Effect/Exit";
import * as Sl from "@effect-ts/core/Sync/Layer";
import { LiveGithub } from "./effects/github";

ReactDOM.render(
  <React.StrictMode>
    <App layer={LiveGithub} />
  </React.StrictMode>,
  document.getElementById("root")
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
