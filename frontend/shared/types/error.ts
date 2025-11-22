// SPDX-License-Identifier: AGPL-3.0-or-later
export enum AppErrorCause {
  NETWORK = "network",
  TIMEOUT = "timeout",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  VALIDATION = "validation",
  RATE_LIMITED = "rate_limited",
  SERVER = "server",
  UNKNOWN = "unknown",
}
