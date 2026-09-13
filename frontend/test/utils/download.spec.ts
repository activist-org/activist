// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { downloadBlob } from "../../app/utils/download";

describe("downloadBlob", () => {
  const objectUrl = "blob:calendar";
  let click: ReturnType<typeof vi.spyOn>;
  let createElement: ReturnType<typeof vi.spyOn>;
  let createObjectURL: ReturnType<typeof vi.spyOn>;
  let revokeObjectURL: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    createElement = vi.spyOn(document, "createElement");
    createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue(objectUrl);
    revokeObjectURL = vi.spyOn(URL, "revokeObjectURL");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("downloads the Blob with the requested filename and cleans up", () => {
    const blob = new Blob(["BEGIN:VCALENDAR"], { type: "text/calendar" });

    downloadBlob(blob, "activist_event_test.ics");

    const link = createElement.mock.results[0]?.value as HTMLAnchorElement;
    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(link.href).toBe(objectUrl);
    expect(link.download).toBe("activist_event_test.ics");
    expect(click).toHaveBeenCalledOnce();
    expect(link.isConnected).toBe(false);
    expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl);
  });

  it("cleans up when activating the download fails", () => {
    const error = new Error("download failed");
    click.mockImplementationOnce(() => {
      throw error;
    });

    expect(() =>
      downloadBlob(new Blob(["calendar"]), "activist_event.ics")
    ).toThrow(error);

    const link = createElement.mock.results[0]?.value as HTMLAnchorElement;
    expect(link.isConnected).toBe(false);
    expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl);
  });
});
