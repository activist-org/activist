// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, describe, expect, it, vi } from "vitest";

import { useGetLabelByKeyFilter } from "../../app/composables/useGetLabelByKeyFilter";

describe("composables/useGetLabelByKeyFilter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // MARK: Topics

  it("translates known topic values into localized labels", () => {
    const { getLabelByKey } = useGetLabelByKeyFilter();

    expect(getLabelByKey("topics", "ENVIRONMENT")).toBe("Environment");
    expect(getLabelByKey("topics", "ACCESSIBILITY")).toBe(
      "Accessibility and Inclusion"
    );
  });

  it("does not return raw i18n keys for topics", () => {
    const { getLabelByKey } = useGetLabelByKeyFilter();

    expect(getLabelByKey("topics", "ENVIRONMENT")).not.toBe(
      "i18n.constants.topics.environment"
    );
  });

  it("falls back to the raw value for unknown topics", () => {
    const { getLabelByKey } = useGetLabelByKeyFilter();

    expect(getLabelByKey("topics", "NOT_A_TOPIC")).toBe("NOT_A_TOPIC");
  });

  // MARK: Event Types and Time Ranges

  it("translates event types", () => {
    const { getLabelByKey } = useGetLabelByKeyFilter();

    expect(getLabelByKey("type", "action")).toBe("Action");
    expect(getLabelByKey("type", "learn")).toBe("Learn");
  });

  it("translates days ahead with the value interpolated", () => {
    const { getLabelByKey } = useGetLabelByKeyFilter();

    expect(getLabelByKey("days_ahead", 7)).toBe("Next 7 days");
  });

  // MARK: Locations

  it("translates location types", () => {
    const { getLabelByKey } = useGetLabelByKeyFilter();

    expect(getLabelByKey("locationType", "online")).toBe("Online Location");
    expect(getLabelByKey("locationType", "physical")).toBe("Physical Location");
  });

  it("uses the country name when available and falls back to the code", () => {
    vi.stubGlobal("useNuxtApp", () => ({
      $countryName: (code: string) => (code === "de" ? "Germany" : ""),
    }));

    const { getLabelByKey } = useGetLabelByKeyFilter();

    expect(getLabelByKey("country", "de")).toBe("Germany");
    expect(getLabelByKey("country", "xx")).toBe("xx");
  });

  // MARK: Plain Values

  it("passes through plain string values", () => {
    const { getLabelByKey } = useGetLabelByKeyFilter();

    expect(getLabelByKey("name", "Bietigheim-Bissingen")).toBe(
      "Bietigheim-Bissingen"
    );
    expect(getLabelByKey("city", "Stuttgart")).toBe("Stuttgart");
    expect(getLabelByKey("unknown_key", 42)).toBe("42");
  });
});
