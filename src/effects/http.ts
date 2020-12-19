import { tag } from "@effect-ts/core/Has";
import * as Sl from "@effect-ts/core/Sync/Layer";
import * as Sy from "@effect-ts/core/Sync";
import * as As from "@effect-ts/core/Async";
import type { _A } from "@effect-ts/core/Utils";

const makeFetch = () => {
  return {
    fetch,
  };
};

export class FetchError {
  readonly _tag = "HttpError";
  constructor(readonly error: unknown) {}
}
export class TextError {
  readonly _tag = "TextError";
  constructor(readonly error: unknown) {}
}
export class JsonError {
  readonly _tag = "JsonError";
  constructor(readonly error: unknown) {}
}

export interface Fetch extends ReturnType<typeof makeFetch> {}

export const Fetch = tag<Fetch>();

const FetchLive = Sl.fromFunction(Fetch)(makeFetch);

export const Init = tag<RequestInit>();

const makeHttp = Sy.gen(function* (_) {
  const { fetch } = yield* _(Fetch);
  const init = yield* _(Init);

  const _fetch = (url: string) =>
    As.gen(function* (_) {
      const res = yield* _(
        As.promise((u) => new FetchError(u))(async () => fetch(url, init))
      );
      if (!res.ok) {
        return yield* _(As.fail(new FetchError(res)));
      }
      return res;
    });
  return {
    getJson: (url: string) =>
      _fetch(url)["|>"](
        As.chain((res) => As.promise((u) => new JsonError(u))(() => res.json()))
      ),
    getText: (url: string) =>
      _fetch(url)["|>"](
        As.chain((res) => As.promise((u) => new JsonError(u))(() => res.text()))
      ),
  };
});

export interface Http extends _A<typeof makeHttp> {}

export const Http = tag<Http>();

export const LiveHttp = Sl.fromSync(Http)(makeHttp)["<<<"](FetchLive);
