// SPDX-License-Identifier: AGPL-3.0-or-later

import DOMPurify from "dompurify";

interface DirectiveBinding {
  value: {
    allowedTags?: string[];
    allowedAttrs?: string[];
  };
}

interface SanitizedHTMLElement extends HTMLElement {
  _sanitizeHandler: (event: Event) => void;
}

export default {
  mounted(el: SanitizedHTMLElement, binding: DirectiveBinding) {
    // TODO: Find out where these come from and what they are.
    const allowedTags = binding.value?.allowedTags || [];
    const allowedAttrs = binding.value?.allowedAttrs || [];

    // Define sanitize function outside to make it available for both mounted and beforeUnmount hooks
    const sanitize = (event: Event) => {
      const target = event.target as HTMLTextAreaElement | HTMLInputElement;
      const originalValue = target.value;
      const sanitizedValue = DOMPurify.sanitize(originalValue, {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttrs,
      });

      // If the value has been sanitized, update the input and show an alert
      if (originalValue !== sanitizedValue) {
        target.value = sanitizedValue;
        target.dispatchEvent(new Event("input")); // Ensure Vue updates v-model

        alert("Suspicious input detected and sanitized.");
      }
    };

    // List of valid text input types
    const validTextInputs: string[] = [
      "text",
      "email",
      "search",
      "password",
      "tel",
      "url",
    ];

    // Attach the listener only if the element is a text input or a textarea
    if (
      (el.tagName === "INPUT" &&
        validTextInputs.includes(
          el.getAttribute("type")?.toLowerCase() || ""
        )) ||
      el.tagName === "TEXTAREA"
    ) {
      el.addEventListener("input", sanitize);
    }

    // Save sanitize function to remove event listener later
    (el as SanitizedHTMLElement)._sanitizeHandler = sanitize;
  },
  beforeUnmount(el: SanitizedHTMLElement) {
    // Clean up event listener when directive is removed
    if (el._sanitizeHandler) {
      el.removeEventListener("input", el._sanitizeHandler);
    }
  },
};
