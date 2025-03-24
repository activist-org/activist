// SPDX-License-Identifier: AGPL-3.0-or-later

import sanitizeDirective from "~/directives/sanitize";

interface SanitizedHTMLElement extends HTMLElement {
  _sanitizeHandler: (event: Event) => void;
}

export default defineNuxtPlugin((nuxtApp) => {
  // Register directive globally.
  nuxtApp.vueApp.directive("sanitize", sanitizeDirective);

  // Prevent execution on the server.
  if (import.meta.server) {
    return;
  }

  const applySanitizeDirective = () => {
    document.querySelectorAll("input[type='text'], textarea").forEach((el) => {
      if (!el.hasAttribute("data-sanitized")) {
        // Manually apply directive.
        sanitizeDirective.mounted(el as SanitizedHTMLElement, { value: {} });
        el.setAttribute("data-sanitized", "true"); // prevent duplicate applications
      }
    });
  };

  // Run once after initial page load.
  window.addEventListener("load", applySanitizeDirective);

  // Use MutationObserver to catch dynamically added elements.
  const observer = new MutationObserver(() => {
    applySanitizeDirective();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
