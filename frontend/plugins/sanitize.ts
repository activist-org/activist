// SPDX-License-Identifier: AGPL-3.0-or-later

import sanitizeDirective from "~/directives/sanitize"; // Import the existing directive
interface SanitizedHTMLElement extends HTMLElement {
  _sanitizeHandler: (event: Event) => void;
}

export default defineNuxtPlugin((nuxtApp) => {
  // Register directive globally
  nuxtApp.vueApp.directive("sanitize", sanitizeDirective);

  if (import.meta.server) return; // Prevent execution on the server

  const applySanitizeDirective = () => {
    document.querySelectorAll("input[type='text'], textarea").forEach((el) => {
      if (!el.hasAttribute("data-sanitized")) {
        sanitizeDirective.mounted(el as SanitizedHTMLElement, { value: {} }); // Manually apply directive
        el.setAttribute("data-sanitized", "true"); // Prevent duplicate applications
      }
    });
  };

  // Run once after initial page load
  window.addEventListener("load", applySanitizeDirective);

  // Use MutationObserver to catch dynamically added elements
  const observer = new MutationObserver(() => {
    applySanitizeDirective();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
