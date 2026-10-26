// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Ref } from "vue";

import { describe, expect, it, vi } from "vitest";

import ModalQRCodeImage from "../../../../app/components/modal/qr-code/ModalQRCodeImage.vue";
import render from "../../../render";

const { encodedSources } = vi.hoisted(() => ({
  encodedSources: [] as Ref<string>[],
}));

vi.mock("@vueuse/integrations/useQRCode", async () => {
  const { ref } = await import("vue");
  return {
    useQRCode: (source: Ref<string>) => {
      encodedSources.push(source);
      return ref("");
    },
  };
});

describe("ModalQRCodeImage", () => {
  it("encodes the URL passed as codeUrl", async () => {
    await render(ModalQRCodeImage, {
      props: { codeUrl: "https://example.com/guide" },
    });

    expect(encodedSources.at(-1)?.value).toBe("https://example.com/guide");
  });
});
