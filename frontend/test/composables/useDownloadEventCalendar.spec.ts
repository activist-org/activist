// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getEventCalendarFilename,
  useDownloadEventCalendar,
} from "../../app/composables/useDownloadEventCalendar";

const { mockDownloadBlob, mockGetEventCalendarFile, mockHandleError } =
  vi.hoisted(() => ({
    mockDownloadBlob: vi.fn(),
    mockGetEventCalendarFile: vi.fn(),
    mockHandleError: vi.fn(),
  }));

mockNuxtImport("downloadBlob", () => mockDownloadBlob);
mockNuxtImport("getEventCalendarFile", () => mockGetEventCalendarFile);
mockNuxtImport("useAppError", () => () => ({
  handleError: mockHandleError,
}));

describe("getEventCalendarFilename", () => {
  it("reads the filename format returned by the backend", () => {
    expect(
      getEventCalendarFilename("attachment; filename=community_event.ics")
    ).toBe("community_event.ics");
  });

  it("uses a safe fallback for missing or invalid filenames", () => {
    expect(getEventCalendarFilename(null)).toBe("activist_event.ics");
    expect(getEventCalendarFilename("attachment")).toBe("activist_event.ics");
    expect(getEventCalendarFilename("attachment; filename=event.txt")).toBe(
      "activist_event.ics"
    );
    expect(
      getEventCalendarFilename('attachment; filename="community_event.ics"')
    ).toBe("activist_event.ics");
  });
});

describe("useDownloadEventCalendar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("downloads the event using the response filename", async () => {
    const blob = new Blob(["BEGIN:VCALENDAR"], { type: "text/calendar" });
    mockGetEventCalendarFile.mockResolvedValueOnce({
      blob,
      contentDisposition: "attachment; filename=activist_event_test.ics",
    });
    const { downloadEventCalendar } = useDownloadEventCalendar();

    await downloadEventCalendar("event-id");

    expect(mockGetEventCalendarFile).toHaveBeenCalledWith("event-id");
    expect(mockDownloadBlob).toHaveBeenCalledOnce();
    expect(mockDownloadBlob).toHaveBeenCalledWith(
      blob,
      "activist_event_test.ics"
    );
    expect(mockHandleError).not.toHaveBeenCalled();
  });

  it("delegates failures to the shared error handler", async () => {
    const error = new Error("network");
    mockGetEventCalendarFile.mockRejectedValueOnce(error);
    const { downloadEventCalendar } = useDownloadEventCalendar();

    await expect(downloadEventCalendar("event-id")).resolves.toBeUndefined();

    expect(mockHandleError).toHaveBeenCalledWith(error);
    expect(mockDownloadBlob).not.toHaveBeenCalled();
  });
});
