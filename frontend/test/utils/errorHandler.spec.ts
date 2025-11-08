// SPDX-License-Identifier: AGPL-3.0-or-later
import { FetchError } from "ofetch";
import { describe, it, expect } from "vitest";

import { AppErrorCause } from "../../app/types/error";
import { AppError, errorHandler } from "../../app/utils/errorHandler";

describe("utils/errorHandler", () => {
  // MARK: - AppError Handling

  it("returns AppError as-is", () => {
    const err = new AppError("oops", AppErrorCause.UNKNOWN, { status: 418 });
    const res = errorHandler(err);
    expect(res).toBe(err);
  });

  it("wraps non-Error into UNKNOWN AppError", () => {
    const res = errorHandler(null);
    expect(res).toBeInstanceOf(AppError);
    expect(res.causeTag).toBe(AppErrorCause.UNKNOWN);
    expect(res.message).toBe("Something went wrong");
  });

  it("wraps generic Error into UNKNOWN AppError preserving message", () => {
    const res = errorHandler(new Error("boom"));
    expect(res).toBeInstanceOf(AppError);
    expect(res.causeTag).toBe(AppErrorCause.UNKNOWN);
    expect(res.message).toBe("boom");
  });

  function makeFetchError(
    status: number | undefined,
    data: unknown,
    message = "fetch failed"
  ): FetchError<unknown> {
    const fe = new FetchError(message) as FetchError<unknown>;
    Object.assign(fe, {
      response: status !== undefined ? { status, _data: data } : undefined,
      data,
    });
    return fe;
  }

  // MARK: - FetchError Mapping

  it("maps status codes to causes and extracts message fields", () => {
    const table: Array<
      [number, AppErrorCause, unknown, string, string | undefined]
    > = [
      [400, AppErrorCause.VALIDATION, { message: "m" }, "m", undefined],
      [401, AppErrorCause.UNAUTHORIZED, { error: "e" }, "e", undefined],
      [403, AppErrorCause.FORBIDDEN, { detail: "d" }, "d", undefined],
      [404, AppErrorCause.NOT_FOUND, { errors: ["a", "b"] }, "a, b", undefined],
      [
        422,
        AppErrorCause.VALIDATION,
        { foo: "x", bar: "y" },
        "x, y",
        undefined,
      ],
      [429, AppErrorCause.RATE_LIMITED, "plain", "plain", undefined],
      [500, AppErrorCause.SERVER, {}, "fetch failed", undefined],
    ];

    for (const [status, cause, data, expectedMsg] of table) {
      const out = errorHandler(makeFetchError(status, data));
      expect(out).toBeInstanceOf(AppError);
      expect(out.causeTag).toBe(cause);
      expect(out.status).toBe(status);
      expect(out.message).toBe(expectedMsg);
      expect(out.details).toEqual(data);
    }
  });

  it("prefers code or error_code into AppError.code", () => {
    const withCode = errorHandler(
      makeFetchError(400, { message: "m", code: "C1" })
    );
    expect(withCode.code).toBe("C1");

    const withErrorCode = errorHandler(
      makeFetchError(400, { error_code: "E2" })
    );
    expect(withErrorCode.code).toBe("E2");
  });

  it("falls back to UNKNOWN cause when status is missing", () => {
    const out = errorHandler(makeFetchError(undefined, { message: "m" }));
    expect(out.causeTag).toBe(AppErrorCause.UNKNOWN);
    expect(out.status).toBeUndefined();
  });
});
