import * as As from "@effect-ts/core/Async";
import "@effect-ts/core/Operators";
import * as Sy from "@effect-ts/core/Sync";
import * as Sl from "@effect-ts/core/Sync/Layer";
import { matchTag } from "@effect-ts/core/Utils";
import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import { Github } from "./effects/github";

const app = Sy.gen(function* (_) {
  const { getZen } = yield* _(Github);

  function App() {
    const [zen, setZen] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const getNewZen = async () => {
      As.runAsync(getZen(), (ex) => {
        ex["|>"](
          matchTag({
            Success: ({ a }) => {
              setZen(a);
              setErr(null);
            },
            Failure: ({ e }) => {
              setErr(e.toString());
            },
            Interrupt: (_) => {
              setErr("Interrupted");
            },
          })
        );
      });
    };

    useEffect(() => {
      getNewZen();
    }, []);

    return (
      <>
        <p title="zen">{zen}</p>
        {err != null && (
          <p title="error" className={styles.error}>
            {err}
          </p>
        )}
        <button onClick={async () => getNewZen()}>Get new zen</button>
      </>
    );
  }
  return App();
});

export default function App<
  L extends Sl.SyncLayer<
    unknown,
    never,
    typeof app extends Sy.Sync<infer R, never, any> ? R : never
  >
>(props: { layer: L }) {
  // app is Sy.Sync<Has<Github>, never, JSX.Element>
  return app["|>"](Sl.provideSyncLayer(props.layer))["|>"](Sy.run);
}
