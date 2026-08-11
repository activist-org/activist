// SPDX-License-Identifier: AGPL-3.0-or-later
import { FetchError } from "ofetch";
import { describe, it, expect } from "vitest";

import { AppErrorCause } from "../../shared/types/error";
import { AppError, errorHandler } from "../../shared/utils/errorHandler";

describe("utils/errorHandler", () => {
  // MARK: AppError Handling

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

  // MARK: FetchError Mapping

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

  it("surfaces DRF-style field-keyed array error messages", () => {
    // Django REST Framework's serializers.ValidationError("message"), raised
    // from a whole-serializer validate() (as the image-upload size check
    // does), produces {"non_field_errors": ["message"]} -- an array value,
    // not a plain string -- which the old plain-string-only fallback
    // silently dropped. djangorestframework-camel-case renames the key on the
    // way out, so this is the shape that reaches the browser.
    // https://github.com/activist-org/activist/issues/2332
    const out = errorHandler(
      makeFetchError(400, {
        nonFieldErrors: [
          "The file size (6291456 bytes) is too large. The maximum file size is 5MB.",
        ],
      })
    );
    expect(out.message).toBe(
      "The file size (6291456 bytes) is too large. The maximum file size is 5MB."
    );
  });

  it("surfaces the snake_case form of the same shape", () => {
    // Endpoints that bypass the camel-case renderer still send non_field_errors.
    const out = errorHandler(
      makeFetchError(400, { non_field_errors: ["No file was submitted."] })
    );
    expect(out.message).toBe("No file was submitted.");
  });

  it("reports a 413 from the edge guard rather than a backend message", () => {
    // nuxt-security's requestSizeLimiter answers oversized uploads on the Nuxt
    // server, before the request reaches the backend, so there is no validation
    // message to surface -- only h3's own error body. Seeing this toast for an
    // upload means the request never got to the size check, which is why
    // maxUploadFileRequestInBytes has to stay above what the backend accepts.
    const out = errorHandler(
      makeFetchError(413, {
        url: "/api/auth/content/images",
        statusCode: 413,
        statusMessage: "Payload Too Large",
        message: "Payload Too Large",
      })
    );
    expect(out.message).toBe("Payload Too Large");
    expect(out.status).toBe(413);
  });

  it("joins multiple field-keyed array errors together", () => {
    const out = errorHandler(
      makeFetchError(400, {
        file_object: ["too large"],
        name: ["required"],
      })
    );
    expect(out.message).toBe("too large, required");
  });

  it("falls back to UNKNOWN cause when status is missing", () => {
    const out = errorHandler(makeFetchError(undefined, { message: "m" }));
    expect(out.causeTag).toBe(AppErrorCause.UNKNOWN);
    expect(out.status).toBeUndefined();
  });
});
