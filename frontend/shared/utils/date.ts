// SPDX-License-Identifier: AGPL-3.0-or-later
export const getAllDaysInRange = (range: {
  start: Date;
  end: Date;
}): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(range.start);
  while (currentDate <= range.end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};
