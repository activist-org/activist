// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import {
  buildTimesForDateRange,
  combineDateAndTime,
  eventTimesToSchedule,
  formatDate,
  getAllDaysInRange,
  isAllDayEventTime,
  mapScheduleTimesToEventTimeInput,
  normalizeCalendarRange,
  parseCalendarDateFromIso,
  toLocalDateString,
} from "../../shared/utils/date";

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

  describe("toLocalDateString", () => {
    it("formats calendar day in local time as YYYY-MM-DD", () => {
      const date = new Date(2026, 5, 15, 23, 30);
      expect(toLocalDateString(date)).toBe("2026-06-15");
    });
  });

  describe("combineDateAndTime", () => {
    it("applies time-of-day onto the selected calendar day", () => {
      const day = new Date(2026, 5, 20);
      const time = new Date(2020, 0, 1, 14, 30, 0);

      const combined = combineDateAndTime(day, time);

      expect(combined.getFullYear()).toBe(2026);
      expect(combined.getMonth()).toBe(5);
      expect(combined.getDate()).toBe(20);
      expect(combined.getHours()).toBe(14);
      expect(combined.getMinutes()).toBe(30);
    });
  });

  describe("parseCalendarDateFromIso", () => {
    it("parses the date prefix as local midnight", () => {
      const date = parseCalendarDateFromIso("2026-09-13T00:00:00Z");
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(8);
      expect(date.getDate()).toBe(13);
    });
  });

  describe("eventTimesToSchedule", () => {
    it("maps a single all-day UTC time to one calendar day", () => {
      const schedule = eventTimesToSchedule([
        {
          startTime: "2026-09-13T00:00:00Z",
          endTime: "2026-09-13T23:59:59Z",
          allDay: true,
          date: "2026-09-13",
        },
      ]);

      expect(schedule.dates.start.getDate()).toBe(13);
      expect(schedule.dates.end.getDate()).toBe(13);
      expect(schedule.dates.start.getMonth()).toBe(8);
      expect(schedule.times).toHaveLength(1);
      expect(schedule.times[0].allDayLong).toBe(true);
    });

    it("detects all-day pattern when allDay flag is missing", () => {
      expect(
        isAllDayEventTime({
          startTime: "2026-09-13T00:00:00Z",
          endTime: "2026-09-13T23:59:59Z",
          allDay: false,
          date: "2026-09-13",
        })
      ).toBe(true);
    });

    it("maps a single timed entry to one calendar day", () => {
      const schedule = eventTimesToSchedule([
        {
          startTime: "2026-06-15T14:00:00Z",
          endTime: "2026-06-15T18:00:00Z",
          allDay: false,
          date: "2026-06-15",
        },
      ]);

      expect(schedule.dates.start.getTime()).toBe(schedule.dates.end.getTime());
      expect(schedule.times[0].date.getTime()).toBe(
        schedule.dates.start.getTime()
      );
    });

    it("maps multiple entries across calendar days", () => {
      const schedule = eventTimesToSchedule([
        {
          startTime: "2026-06-15T10:00:00Z",
          endTime: "2026-06-15T12:00:00Z",
          allDay: false,
          date: "2026-06-15",
        },
        {
          startTime: "2026-06-16T10:00:00Z",
          endTime: "2026-06-16T12:00:00Z",
          allDay: false,
          date: "2026-06-16",
        },
      ]);

      expect(schedule.dates.start.getDate()).toBe(15);
      expect(schedule.dates.end.getDate()).toBe(16);
      expect(schedule.times).toHaveLength(2);
    });
  });

  describe("normalizeCalendarRange", () => {
    it("collapses v-calendar exclusive end midnight to a single day", () => {
      const start = new Date(2026, 8, 13);
      const end = new Date(2026, 8, 14);

      const normalized = normalizeCalendarRange({ start, end });

      expect(normalized.start.getDate()).toBe(13);
      expect(normalized.end.getDate()).toBe(13);
    });

    it("collapses a 2-day local UTC all-day hydration range to one day", () => {
      const start = new Date(2026, 8, 12);
      const end = new Date(2026, 8, 13);
      const currentTimes = [
        {
          date: new Date(2026, 8, 13),
          allDayLong: true,
          startTime: new Date("2026-09-13T00:00:00Z"),
          endTime: new Date("2026-09-13T23:59:59Z"),
        },
      ];

      const normalized = normalizeCalendarRange({ start, end }, currentTimes);

      expect(normalized.start.getDate()).toBe(13);
      expect(normalized.end.getDate()).toBe(13);
    });
  });

  describe("buildTimesForDateRange", () => {
    it("preserves allDayLong when hydrating a single saved all-day entry", () => {
      const savedDay = new Date(2026, 8, 13);
      const currentTimes = [
        {
          date: savedDay,
          startTime: new Date("2026-09-13T00:00:00Z"),
          endTime: new Date("2026-09-13T23:59:59Z"),
          allDayLong: true,
        },
      ];

      const rebuilt = buildTimesForDateRange(
        { start: savedDay, end: new Date(2026, 8, 14) },
        currentTimes
      );

      expect(rebuilt).toHaveLength(1);
      expect(rebuilt[0].allDayLong).toBe(true);
    });
  });

  describe("mapScheduleTimesToEventTimeInput", () => {
    it("maps all-day and timed entries for the API", () => {
      const day = new Date(2026, 5, 15);
      const startTime = new Date(2026, 5, 15, 10, 0);
      const endTime = new Date(2026, 5, 15, 12, 0);

      const payload = mapScheduleTimesToEventTimeInput([
        { date: day, startTime: day, endTime: day, allDayLong: true },
        { date: day, startTime, endTime, allDayLong: false },
      ]);

      expect(payload[0]).toEqual({ date: "2026-06-15", all_day: true });
      expect(payload[1].all_day).toBe(false);
      expect(payload[1].start_time).toBeTruthy();
      expect(payload[1].end_time).toBeTruthy();
    });
  });
});
