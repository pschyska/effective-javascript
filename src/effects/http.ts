import { tag } from "@effect-ts/core/Has";
import * as Sl from "@effect-ts/core/Sync/Layer";
import * as Sy from "@effect-ts/core/Sync";
import * as As from "@effect-ts/core/Async";
import type { _A } from "@effect-ts/core/Utils";
import { fetch } from "cross-fetch";

const makeFetch = () => {
  return {
    fetch,
  };
};

export abstract class HttpError {
  abstract readonly _tag: string = "HttpError";
  readonly error: string;
  constructor(error: unknown) {
    this.error =
      typeof error === "string"
        ? error
        : error instanceof Object
        ? error.toString()
        : "<unknown>";
  }
  toString(): string {
    return `${this._tag}: ${this.error}`;
  }
  get [Symbol.toStringTag](): string {
    return this._tag;
  }
}

export class FetchError extends HttpError {
  readonly _tag = "FetchError";
}

export class DecodeError extends HttpError {
  readonly _tag = "JsonError";
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
        As.promise((u) => new FetchError(u))(() => fetch(url, init))
      );
      if (!res.ok) {
        return yield* _(
          As.fail(new FetchError(`not ok, ${res.status} "${res.statusText}"`))
        );
      }
      return res;
    });
  return {
    getJson: (url: string) =>
      _fetch(url)["|>"](
        As.chain((res) =>
          As.promise((u) => new DecodeError(u))(() => res.json())
        )
      ),
    getText: (url: string) =>
      _fetch(url)["|>"](
        As.chain((res) =>
          As.promise((u) => new DecodeError(u))(() => res.text())
        )
      ),
  };
});

export interface Http extends _A<typeof makeHttp> {}

export const Http = tag<Http>();

export const LiveHttp = Sl.fromSync(Http)(makeHttp)["<<<"](FetchLive);
