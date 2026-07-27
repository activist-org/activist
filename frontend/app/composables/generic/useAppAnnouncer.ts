// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Composable for handling accessibility screen reader live announcements.
 * Standardizes ARIA live region announcements for dynamic UI updates,
 * toasts, modal state changes, and async error/success messages.
 */
export function useAppAnnouncer() {
  const announceMessage = (
    message: string,
    politeness: "polite" | "assertive" = "polite"
  ) => {
    if (!message) return;
    try {
      const announcer = useAnnouncer();
      if (announcer && typeof announcer.announce === "function") {
        announcer.announce(message, politeness);
      }
    } catch {
      // Fallback if useAnnouncer is unavailable in test or non-Nuxt contexts
    }
  };

  const announcePolite = (message: string) => {
    announceMessage(message, "polite");
  };

  const announceAssertive = (message: string) => {
    announceMessage(message, "assertive");
  };

  return {
    announceMessage,
    announcePolite,
    announceAssertive,
  };
}
