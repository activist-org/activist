// SPDX-License-Identifier: AGPL-3.0-or-later
import { downloadEventCalendar } from "~/services/event/event";

export const useDownloadEventCalendar = () => {
  const { showToastError } = useToaster();

  const handleDownload = async (eventId: string, eventName?: string) => {
    if (!eventId) return;
    try {
      await downloadEventCalendar(eventId, eventName);
    } catch {
      showToastError("Failed to download calendar entry. Please try again.");
    }
  };

  return {
    handleDownload,
  };
};
