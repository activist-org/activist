// SPDX-License-Identifier: AGPL-3.0-or-later
import { AppErrorCause } from "#shared/types/error";
import { FetchError } from "ofetch";

export class AppError extends Error {
  status?: number;
  code?: string;
  causeTag: AppErrorCause;
  details?: unknown;

  constructor(
    message: string,
    causeTag: AppErrorCause,
    opts?: { status?: number; code?: string; details?: unknown }
  ) {
    super(message);
    this.name = "AppError";
    this.causeTag = causeTag ?? AppErrorCause.UNKNOWN;
    this.status = opts?.status;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}

const statusToCause: Record<number, AppErrorCause> = {
  400: AppErrorCause.VALIDATION,
  401: AppErrorCause.UNAUTHORIZED,
  403: AppErrorCause.FORBIDDEN,
  404: AppErrorCause.NOT_FOUND,
  422: AppErrorCause.VALIDATION,
  429: AppErrorCause.RATE_LIMITED,
  500: AppErrorCause.SERVER,
};

const getCauseFromStatus = (status?: number): AppErrorCause => {
  if (!status) {
    return AppErrorCause.UNKNOWN;
  }
  return statusToCause[status] || AppErrorCause.UNKNOWN;
};

// Handle the various error payload shapes your backend sends.
interface ServerErrorData {
  message?: string;
  error?: string;
  detail?: string;
  errors?: string[];
  code?: string;
  error_code?: string;
  [key: string]: unknown; // for Object.values() to work
}

function extractMessage(data: unknown): string | undefined {
  // Handle string payload (like your sign-up form gets).
  if (typeof data === "string") {
    return data;
  }

  // Handle object payload.
  if (data && typeof data === "object") {
    const errorData = data as ServerErrorData;

    // Try standard error fields first.
    if (errorData.message) {
      return errorData.message;
    }
    if (errorData.error) {
      return errorData.error;
    }
    if (errorData.detail) {
      return errorData.detail;
    }
    if (Array.isArray(errorData.errors)) {
      return errorData.errors.join(", ");
    }

    // Fall back to joining all string values (your current approach)
    const values = Object.values(errorData)
      .filter((v): v is string => typeof v === "string")
      .filter(Boolean);

    return values.length > 0 ? values.join(", ") : undefined;
  }

  return undefined;
}

/**
 * Centralized error handler for HTTP requests.
 * Handles both FetchError and generic Errors.
 * Infers the error cause from the response and normalizes it into an AppError.
 */
export function errorHandler(e: unknown): AppError {
  if (e instanceof AppError) {
    return e;
  }

  if (!(e instanceof Error)) {
    return new AppError("Something went wrong", AppErrorCause.UNKNOWN);
  }

  if (!(e instanceof FetchError)) {
    return new AppError(
      e.message || "Something went wrong",
      AppErrorCause.UNKNOWN
    );
  }

  const status = e.response?.status;
  const data = e.data ?? e.response?._data;
  const errorData = (
    data && typeof data === "object" ? data : {}
  ) as ServerErrorData;
  const code = errorData.code ?? errorData.error_code;

  const cause =
    getCauseFromStatus(status) ||
    (e.name === "FetchError" ? AppErrorCause.NETWORK : AppErrorCause.UNKNOWN);

  const serverMsg = extractMessage(data);
  const message = serverMsg || e.message || "Something went wrong";

  return new AppError(message, cause, { status, code, details: data });
}
