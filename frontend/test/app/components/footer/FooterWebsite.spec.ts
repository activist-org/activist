/// <reference types="vitest" />

import { describe, it, expect } from "vitest";
import  render  from "../../../render";

import FooterWebsite from "../../../../app/components/footer/FooterWebsite.vue";

describe("FooterWebsite", () => {
  it("renders without crashing", async () => {
    const { container } = await render(FooterWebsite);
    expect(container).toBeTruthy();
  });
});
