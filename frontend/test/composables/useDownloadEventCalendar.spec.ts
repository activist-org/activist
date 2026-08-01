// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDownloadEventCalendar } from "../../app/composables/useDownloadEventCalendar";
import * as eventService from "../../app/services/event/event";

vi.mock("../../app/services/event/event", () => ({
  downloadEventCalendar: vi.fn(),
}));

describe("useDownloadEventCalendar composable", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls downloadEventCalendar service with correct event ID and name", async () => {
    const downloadSpy = vi.spyOn(eventService, "downloadEventCalendar").mockResolvedValue();
    const { handleDownload } = useDownloadEventCalendar();

    await handleDownload("event-uuid-123", "Test Event");

    expect(downloadSpy).toHaveBeenCalledTimes(1);
    expect(downloadSpy).toHaveBeenCalledWith("event-uuid-123", "Test Event");
  });

  it("handles missing event ID gracefully without calling download service", async () => {
    const downloadSpy = vi.spyOn(eventService, "downloadEventCalendar");
    const { handleDownload } = useDownloadEventCalendar();

    await handleDownload("", "Test Event");

    expect(downloadSpy).not.toHaveBeenCalled();
  });
});
