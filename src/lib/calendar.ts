export type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

export type CalendarNotes = {
  monthNotes: Record<string, string>;
  dayNotes: Record<string, string>;
};

export function readCalendarNotes(storageKey: string): CalendarNotes {
  if (typeof window === "undefined") {
    return { monthNotes: {}, dayNotes: {} };
  }

  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return { monthNotes: {}, dayNotes: {} };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CalendarNotes>;
    return {
      monthNotes: parsed.monthNotes ?? {},
      dayNotes: parsed.dayNotes ?? {},
    };
  } catch {
    localStorage.removeItem(storageKey);
    return { monthNotes: {}, dayNotes: {} };
  }
}

/** Local calendar day as YYYY-MM-DD (avoid UTC shift from toISOString). */
export function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDateInInclusiveRange(
  date: Date,
  rangeStart: Date,
  rangeEnd: Date,
): boolean {
  const t = startOfDay(date).getTime();
  return t >= startOfDay(rangeStart).getTime() && t <= startOfDay(rangeEnd).getTime();
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthHeading(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMonthLong(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
}

export function formatShortLocalDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildCalendarDays(viewDate: Date): CalendarDay[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDay[] = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    days.push({
      date: new Date(year, month, i - firstWeekday + 1),
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  while (days.length % 7 !== 0) {
    const overflowDay = days.length - (firstWeekday + daysInMonth) + 1;
    days.push({
      date: new Date(year, month + 1, overflowDay),
      inCurrentMonth: false,
    });
  }

  return days;
}
