import { tag } from "@effect-ts/core/Has";
import * as As from "@effect-ts/core/Async";
import * as Sy from "@effect-ts/core/Sync";
import * as Sl from "@effect-ts/core/Sync/Layer";
import type { _A } from "@effect-ts/core/Utils";
import { Http, Init, LiveHttp } from "./http";

const makeGithub = Sy.gen(function* (_) {
  const http = yield* _(Http);

  return {
    getZen: () =>
      As.gen(function* (_) {
        return yield* _(http.getText("https://api.github.com/zen"));
      }),
  };
});

export interface Github extends _A<typeof makeGithub> {}

export const Github = tag<Github>();

const init = Sl.fromValue(Init)({
  headers: { Accept: "application/vnd.github.v3+json" },
});

export const LiveGithub = Sl.fromSync(Github)(makeGithub)
  ["<<<"](LiveHttp)
  ["<<<"](init);
