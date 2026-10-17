// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

import ModalQRCode from "../../../../app/components/modal/qr-code/ModalQRCode.vue";
import render from "../../../render";

mockNuxtImport("useGetBaseURLs", () => () => ({
  BASE_FRONTEND_URL: "https://activist.org",
}));

const stubs = {
  ModalBase: { template: "<div><slot /></div>" },
  DialogTitle: { template: "<div><slot /></div>" },
  ModalQRCodeImage: {
    props: ["codeUrl"],
    methods: { getSize: () => ({ width: 0, height: 0 }) },
    template: '<div data-testid="qr-image" :data-code-url="codeUrl"></div>',
  },
  TooltipBase: true,
  BtnActionDropdown: true,
  BtnAction: true,
};

const renderedCodeUrl = async (linkUrl: string) => {
  const { getByTestId } = await render(ModalQRCode, {
    props: { linkUrl },
    global: { stubs },
  });
  return getByTestId("qr-image").getAttribute("data-code-url");
};

describe("ModalQRCode", () => {
  it("prefixes the frontend URL for a path", async () => {
    expect(await renderedCodeUrl("/organizations/org-id/about")).toBe(
      "https://activist.org/organizations/org-id/about"
    );
  });

  it("keeps a full activist URL as is", async () => {
    expect(await renderedCodeUrl("https://activist.org/events/event-id")).toBe(
      "https://activist.org/events/event-id"
    );
  });

  it("encodes an external resource URL as is", async () => {
    expect(await renderedCodeUrl("https://example.com/guide")).toBe(
      "https://example.com/guide"
    );
  });
});
