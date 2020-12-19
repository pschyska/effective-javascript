import { useEffect, useState } from "react";
import "@effect-ts/core/Operators";
import * as Sy from "@effect-ts/core/Sync";
import * as Sl from "@effect-ts/core/Sync/Layer";
import * as As from "@effect-ts/core/Async";

import styles from "./App.module.css";
import { Github, LiveGithub } from "./effects/github";
import React from "react";
import { FetchError, TextError } from "./effects/http";

export default () => {
  const [zen, setZen] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const getNewZen = async () => {
    try {
      const z = await As.runPromise(getZen());
      setZen(z);
      setErr(null);
    } catch (e) {
      if (e instanceof FetchError || e instanceof TextError) {
        setErr(`Unable to get new zen: ${e.error}`);
      } else {
        setErr(`Unable to get new zen: ${e}`);
      }
    }
  };

  useEffect(() => {
    getNewZen();
  }, []);

  return (
    <>
      <p>{zen}</p>
      {err != null && <p className="error">{err}</p>}
      <button onClick={async () => getNewZen()}>Get new zen</button>
    </>
  );
};

const { getZen } = Sy.gen(function* (_) {
  const { getZen } = yield* _(Github);
  return { getZen };
})
  ["|>"](Sl.provideSyncLayer(LiveGithub))
  ["|>"](Sy.run);
