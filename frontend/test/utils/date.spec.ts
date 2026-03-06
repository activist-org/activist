// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import { getAllDaysInRange } from "../../shared/utils/date";

describe("utils/date", () => {
  describe("getAllDaysInRange", () => {
    it("getAllDaysInRange returns inclusive dates", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-03");
      const out = getAllDaysInRange({ start, end });
      expect(out.map((d) => d.toISOString().slice(0, 10))).toEqual([
        "2024-01-01",
        "2024-01-02",
        "2024-01-03",
      ]);
    });

    it("handles single-day ranges", () => {
      const day = new Date("2024-06-15");
      const out = getAllDaysInRange({ start: day, end: day });
      expect(out).toHaveLength(1);
      expect(out[0]!.toISOString().slice(0, 10)).toBe("2024-06-15");
    });

    // MARK: Edge Cases

    it("returns empty array when end is before start", () => {
      const start = new Date("2024-12-31");
      const end = new Date("2024-01-01");
      const out = getAllDaysInRange({ start, end });
      expect(out).toHaveLength(0);
    });

    it("handles large date ranges", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-31");
      const out = getAllDaysInRange({ start, end });
      expect(out).toHaveLength(31);
      expect(out[0]!.toISOString().slice(0, 10)).toBe("2024-01-01");
      expect(out[30]!.toISOString().slice(0, 10)).toBe("2024-01-31");
    });

    it("handles year boundary crossing", () => {
      const start = new Date("2023-12-30");
      const end = new Date("2024-01-02");
      const out = getAllDaysInRange({ start, end });
      expect(out).toHaveLength(4);
      expect(out.map((d) => d.toISOString().slice(0, 10))).toEqual([
        "2023-12-30",
        "2023-12-31",
        "2024-01-01",
        "2024-01-02",
      ]);
    });

    it("handles leap year dates", () => {
      const start = new Date("2024-02-28");
      const end = new Date("2024-03-01");
      const out = getAllDaysInRange({ start, end });
      expect(out).toHaveLength(3);
      expect(out.map((d) => d.toISOString().slice(0, 10))).toEqual([
        "2024-02-28",
        "2024-02-29",
        "2024-03-01",
      ]);
    });

    it("handles non-leap year February", () => {
      const start = new Date("2023-02-28");
      const end = new Date("2023-03-01");
      const out = getAllDaysInRange({ start, end });
      expect(out).toHaveLength(2);
      expect(out.map((d) => d.toISOString().slice(0, 10))).toEqual([
        "2023-02-28",
        "2023-03-01",
      ]);
    });

    it("preserves time information in returned dates", () => {
      const start = new Date("2024-01-01T12:00:00Z");
      const end = new Date("2024-01-02T12:00:00Z");
      const out = getAllDaysInRange({ start, end });
      expect(out).toHaveLength(2);
      // Each date should be independent.
      expect(out[0]).not.toBe(start);
      expect(out[1]).not.toBe(end);
    });

    it("handles same date with different times", () => {
      const start = new Date("2024-01-01T00:00:00Z");
      const end = new Date("2024-01-01T23:59:59Z");
      const out = getAllDaysInRange({ start, end });
      expect(out).toHaveLength(1);
      expect(out[0]!.toISOString().slice(0, 10)).toBe("2024-01-01");
    });

    it("returns independent Date objects", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-02");
      const out = getAllDaysInRange({ start, end });

      // Each returned date should be a new object.
      expect(out[0]).not.toBe(start);
      expect(out[1]).not.toBe(end);

      // Mutating returned dates should not affect each other.
      out[0]!.setFullYear(2099);
      expect(out[1]!.getFullYear()).toBe(2024);
      expect(out[0]!.getFullYear()).toBe(2099);
    });
  });
  describe("formatDate", () => {
    it("formats date as DD / MM / YYYY", () => {
      const date = new Date("2024-06-15");
      const formatted = formatDate(date);
      expect(formatted).toBe("15 / 06 / 2024");
    });

    it("pads single-digit days and months with leading zeros", () => {
      const date = new Date("2024-01-05");
      const formatted = formatDate(date);
      expect(formatted).toBe("05 / 01 / 2024");
    });

    it("handles end-of-year dates correctly", () => {
      const date = new Date("2024-12-31");
      const formatted = formatDate(date);
      expect(formatted).toBe("31 / 12 / 2024");
    });

    it("handles leap year dates correctly", () => {
      const date = new Date("2024-02-29");
      const formatted = formatDate(date);
      expect(formatted).toBe("29 / 02 / 2024");
    });

    it("handles non-leap year February correctly", () => {
      const date = new Date("2023-02-28");
      const formatted = formatDate(date);
      expect(formatted).toBe("28 / 02 / 2023");
    });

    it("handles dates with time components", () => {
      const date = new Date("2024-06-15T12:34:56Z");
      const formatted = formatDate(date);
      expect(formatted).toBe("15 / 06 / 2024");
    });
  });
});
