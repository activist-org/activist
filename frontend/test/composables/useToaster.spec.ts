// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "vue-sonner";

import { useToaster } from "~/composables/useToaster";

vi.mock("vue-sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

const toastMock = vi.mocked(toast, true);

type ToastScenario = {
  label: string;
  method: "showToastError" | "showToastInfo" | "showToastSuccess";
  spy: typeof toastMock.error;
};

const toastScenarios: ToastScenario[] = [
  { label: "error", method: "showToastError", spy: toastMock.error },
  { label: "info", method: "showToastInfo", spy: toastMock.info },
  { label: "success", method: "showToastSuccess", spy: toastMock.success },
];

describe("useToaster composable", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each(toastScenarios)(
    "forwards messages to toast.%s",
    ({ label, method, spy }) => {
      const message = `Sample ${label} message`;
      const toaster = useToaster();

      toaster[method](message);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(message);

      toastScenarios
        .filter((scenario) => scenario.label !== label)
        .forEach((scenario) => {
          expect(scenario.spy).not.toHaveBeenCalled();
        });
    }
  );

  it.each(toastScenarios)(
    "propagates runtime failures from toast.%s",
    ({ label, method, spy }) => {
      const failure = new Error(`toast ${label} failure`);
      spy.mockImplementationOnce(() => {
        throw failure;
      });
      const toaster = useToaster();
      expect(() => toaster[method]("problematic message")).toThrow(failure);
    }
  );
});
