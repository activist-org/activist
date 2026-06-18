// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  addDays,
  differenceInCalendarDays,
  format,
  isSameDay,
  startOfDay,
} from "date-fns";

import type { EventTime, EventTimeInput } from "../types/event";

export const getAllDaysInRange = (range: {
  start: Date;
  end: Date;
}): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(range.start);
  while (currentDate <= range.end) {
    dates.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates;
};

export const formatDate = (date: Date): string => {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day} / ${month} / ${year}`;
};

/** Calendar day as YYYY-MM-DD in local time (for API date fields). */
export const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Apply the time-of-day from `time` onto the calendar day from `date`. */
export const combineDateAndTime = (date: Date, time: Date): Date => {
  const combined = new Date(date);
  combined.setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
  return combined;
};

/** Calendar day from an ISO datetime's date prefix (YYYY-MM-DD), as local midnight. */
export const parseCalendarDateFromIso = (iso: string): Date => {
  const datePart = iso.split("T")[0] ?? iso;
  const [year = 0, month = 1, day = 1] = datePart.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** Map stored event times to form schedule values (calendar range + per-day entries). */
export const isAllDayEventTime = (entry: EventTime): boolean => {
  if (entry.allDay) return true;

  const startDate = entry.startTime.split("T")[0];
  const endDate = entry.endTime.split("T")[0];
  return (
    startDate === endDate &&
    entry.startTime.includes("T00:00:00") &&
    entry.endTime.includes("T23:59:59")
  );
};

export const getEventTimeCalendarDay = (entry: EventTime): Date => {
  if (isAllDayEventTime(entry)) {
    return parseCalendarDateFromIso(entry.startTime);
  }
  return startOfDay(new Date(entry.startTime));
};

/** Normalize v-calendar range values to inclusive local calendar days. */
export const normalizeCalendarRange = (
  range: {
    start: Date;
    end: Date;
  },
  currentTimes?: {
    date: Date;
    allDayLong?: boolean;
    startTime?: Date | null;
    endTime?: Date | null;
  }[]
): { start: Date; end: Date } => {
  const start = startOfDay(range.start);
  let end = startOfDay(range.end);
  const soleTime = currentTimes?.length === 1 ? currentTimes[0] : undefined;

  // A single saved all-day entry can look like a 2-day local range from UTC times.
  if (
    soleTime?.allDayLong &&
    !isSameDay(start, end) &&
    differenceInCalendarDays(end, start) === 1
  ) {
    const day = startOfDay(new Date(soleTime.date));
    return { start: day, end: day };
  }

  // v-calendar uses an exclusive end at midnight on the day after a single-day pick.
  if (
    !isSameDay(start, end) &&
    range.end.getHours() === 0 &&
    range.end.getMinutes() === 0 &&
    range.end.getSeconds() === 0 &&
    range.end.getMilliseconds() === 0 &&
    differenceInCalendarDays(end, start) === 1
  ) {
    end = start;
  }

  if (isSameDay(start, end)) {
    return { start, end: start };
  }

  return { start, end };
};

export const buildTimesForDateRange = (
  dateRange: { start: Date; end: Date },
  currentTimes: {
    date: Date;
    startTime: Date | null;
    endTime: Date | null;
    allDayLong?: boolean;
  }[]
) => {
  const { start, end } = normalizeCalendarRange(dateRange);
  const daysCount = differenceInCalendarDays(end, start) + 1;
  const newTimes = [];

  for (let i = 0; i < daysCount; i++) {
    const currentDate = addDays(start, i);
    const existing = currentTimes?.find(
      (entry) => entry.date && isSameDay(new Date(entry.date), currentDate)
    );

    if (existing) {
      newTimes.push({
        ...existing,
        date: currentDate,
        startTime:
          existing.startTime instanceof Date
            ? combineDateAndTime(currentDate, existing.startTime)
            : currentDate,
        endTime:
          existing.endTime instanceof Date
            ? combineDateAndTime(currentDate, existing.endTime)
            : currentDate,
      });
    } else {
      newTimes.push({
        date: currentDate,
        startTime: currentDate,
        endTime: currentDate,
        allDayLong: false,
      });
    }
  }

  return newTimes;
};

/** Format a schedule day for display (e.g. "Mon, Jan 1"). */
export const formatScheduleDayLabel = (date: Date | string): string =>
  format(new Date(date), "EEE, MMM d");

/** Map form schedule entries to API event time payloads. */
export const mapScheduleTimesToEventTimeInput = (
  times: {
    date: Date;
    startTime: Date | null;
    endTime: Date | null;
    allDayLong?: boolean;
  }[]
): EventTimeInput[] =>
  times.map((entry) => {
    const date = toLocalDateString(entry.date);

    if (entry.allDayLong) {
      return { date, all_day: true };
    }

    if (
      !(entry.startTime instanceof Date) ||
      !(entry.endTime instanceof Date)
    ) {
      return { date, all_day: false };
    }

    return {
      date,
      all_day: false,
      start_time: combineDateAndTime(entry.date, entry.startTime).toISOString(),
      end_time: combineDateAndTime(entry.date, entry.endTime).toISOString(),
    };
  });

export function eventTimesToSchedule(times: EventTime[]) {
  if (!times.length) {
    const today = startOfDay(new Date());
    return {
      dates: { start: today, end: today },
      times: [
        {
          date: today,
          startTime: today,
          endTime: today,
          allDayLong: false,
        },
      ],
    };
  }

  const calendarDays = times.map(getEventTimeCalendarDay);
  const minTime = Math.min(...calendarDays.map((day) => day.getTime()));
  const maxTime = Math.max(...calendarDays.map((day) => day.getTime()));

  return {
    dates: { start: new Date(minTime), end: new Date(maxTime) },
    times: times.map((entry) => ({
      date: getEventTimeCalendarDay(entry),
      startTime: new Date(entry.startTime),
      endTime: new Date(entry.endTime),
      allDayLong: isAllDayEventTime(entry),
    })),
  };
}
