// SPDX-License-Identifier: AGPL-3.0-or-later
export function useEventCalendarDownload() {
  const { t } = useI18n();
  const { showToastError } = useToaster();
  const isDownloading = ref(false);

  async function downloadCalendarEntry(eventId: string) {
    if (isDownloading.value || !eventId) return;

    isDownloading.value = true;

    try {
      const { calendar, filename } = await downloadEventCalendar(eventId);
      const url = URL.createObjectURL(calendar);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      showToastError(t("i18n.pages.auth._global.error_occurred"));
    } finally {
      isDownloading.value = false;
    }
  }

  return { downloadCalendarEntry, isDownloading };
}
