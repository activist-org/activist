// SPDX-License-Identifier: AGPL-3.0-or-later

const FALLBACK_EVENT_CALENDAR_FILENAME = "activist_event.ics";

export function getEventCalendarFilename(
  contentDisposition: string | null
): string {
  const filename = contentDisposition
    ?.match(/^attachment;\s*filename=([^;]+)$/i)?.[1]
    ?.trim();

  return filename?.toLowerCase().endsWith(".ics")
    ? filename
    : FALLBACK_EVENT_CALENDAR_FILENAME;
}

export function useDownloadEventCalendar() {
  const { handleError } = useAppError();

  const downloadEventCalendar = async (eventId: string): Promise<void> => {
    try {
      const { blob, contentDisposition } = await getEventCalendarFile(eventId);
      downloadBlob(blob, getEventCalendarFilename(contentDisposition));
    } catch (error) {
      handleError(error);
    }
  };

  return { downloadEventCalendar };
}
