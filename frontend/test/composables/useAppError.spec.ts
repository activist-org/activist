// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppError } from "../../shared/utils/errorHandler";

import { useAppError } from "../../app/composables";
import { AppErrorCause } from "../../shared/types/error";
import { createUseUserSessionMock } from "../mocks/composableMocks";

const mocks = vi.hoisted(() => ({
  showToastError: vi.fn(),
}));

// Fallback mocks if auto-imports aren't mapped via #imports in your test environment
vi.mock("../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    return {
      showToastError: mocks.showToastError,
    };
  },
}));

describe("useAppError", () => {
  beforeEach(() => {
    // Reset mocks and state before each test
    vi.clearAllMocks();
    // Default: user is logged out.
    globalThis.useUserSession = createUseUserSessionMock();
  });

  it("initializes with null error state", () => {
    const { error } = useAppError();
    expect(error.value).toBeNull();
  });

  it("handles a generic error: sets state, shows toast, and does NOT clear session", () => {
    // 1. Set the mock FIRST
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 1,
      isAdmin: false,
    });

    // 2. Initialize the composable AFTER the mock is set
    const { error, handleError } = useAppError();

    const mockError: Partial<AppError> = {
      message: "Something went wrong",
      status: 500,
      causeTag: AppErrorCause.SERVER,
    };

    handleError(mockError);

    expect(error.value).toEqual(mockError);
    expect(mocks.showToastError).toHaveBeenCalledWith("Something went wrong");
    expect(mocks.showToastError).toHaveBeenCalledTimes(1);
    expect(globalThis.useUserSession().clear).not.toHaveBeenCalled();
  });

  it("handles a 401 error: clears the user session", () => {
    // 1. Set the mock FIRST
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 1,
      isAdmin: false,
    });

    // 2. Initialize the composable AFTER the mock is set
    const { error, handleError } = useAppError();

    const mockError: Partial<AppError> = {
      message: "Please log in again",
      status: 401, // 401 triggers the sign out
      causeTag: AppErrorCause.UNKNOWN,
    };

    handleError(mockError);

    expect(error.value).toEqual(mockError);
    expect(mocks.showToastError).toHaveBeenCalledWith("Please log in again");
    expect(globalThis.useUserSession().clear).toHaveBeenCalledTimes(1); // Session cleared
  });

  it("handles an UNAUTHORIZED cause: clears the user session", () => {
    // 1. Set the mock FIRST
    globalThis.useUserSession = createUseUserSessionMock(true, {
      id: 1,
      isAdmin: false,
    });

    // 2. Initialize the composable AFTER the mock is set
    const { error, handleError } = useAppError();

    const mockError: Partial<AppError> = {
      message: "You lack permissions",
      status: 400, // Status isn't 401, but causeTag is UNAUTHORIZED
      causeTag: AppErrorCause.UNAUTHORIZED,
    };

    handleError(mockError);

    expect(error.value).toEqual(mockError);
    expect(mocks.showToastError).toHaveBeenCalledWith("You lack permissions");
    expect(globalThis.useUserSession().clear).toHaveBeenCalledTimes(1); // Session cleared
  });

  it("clears the error state when clearError is called", () => {
    const { error, handleError, clearError } = useAppError();

    const mockError: Partial<AppError> = {
      message: "Test error",
      status: 404,
      causeTag: AppErrorCause.NOT_FOUND,
    };

    handleError(mockError);
    expect(error.value).toEqual(mockError); // State is set

    clearError();
    expect(error.value).toBeNull(); // State is cleared
  });

  it("shows a fallback message if error message is missing", () => {
    const { handleError } = useAppError();

    const mockError: Partial<AppError> = {
      status: 500,
      causeTag: AppErrorCause.SERVER,
      // No message provided
    };

    handleError(mockError);

    expect(mocks.showToastError).toHaveBeenCalledWith(
      "An unexpected error occurred"
    );
  });
});
