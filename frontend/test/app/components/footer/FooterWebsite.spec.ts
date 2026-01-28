
/*
 * Copyright (c) 2025 activist
 *
 * This Source Code Form is subject to the terms of the
 * GNU Affero General Public License, version 3.
 */

import { describe, it, expect } from "vitest";

import FooterWebsite from "../../../../app/components/footer/FooterWebsite.vue";
import  {render]  from "../../../render";

describe("FooterWebsite", () => {
  it("renders without crashing", async () => {
    const { container } = await render(FooterWebsite);
    expect(container).toBeTruthy();
  });
});
