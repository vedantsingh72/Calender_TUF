"use client";

import type { HangingCalendarProps } from "@/components/HangingCalendar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildCalendarDays,
  formatMonthHeading,
  formatShortLocalDate,
  monthKey,
  readCalendarNotes,
  startOfDay,
  toKey,
} from "@/lib/calendar";
import { holidays } from "@/lib/holidays";
import { useDynamicTheme } from "@/hooks/useDynamicTheme";

const STORAGE_KEY = "wall-calendar-data-v1";

const HERO_IMAGES = [
  "https://res.cloudinary.com/dg4zrl860/image/upload/q_auto/f_auto/v1775704929/Screenshot_2026-04-09_083639_lfbq36.png",
  "https://res.cloudinary.com/dg4zrl860/image/upload/q_auto/f_auto/v1775705516/Screenshot_2026-04-09_085557_ybjgsq.png",
];

export function useWallCalendar(): HangingCalendarProps {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [monthNotes, setMonthNotes] = useState<Record<string, string>>({});
  const [dayNotes, setDayNotes] = useState<Record<string, string>>({});
  const [storageEpoch, setStorageEpoch] = useState(0);
  const [nightMode, setNightMode] = useState(true);

  const days = useMemo(() => buildCalendarDays(viewDate), [viewDate]);
  const heroImageUrl = HERO_IMAGES[viewDate.getMonth() % HERO_IMAGES.length];
  useDynamicTheme(heroImageUrl, nightMode);

  const currentMonthId = monthKey(viewDate);
  const savedMonthNote = monthNotes[currentMonthId] ?? "";

  const selectedDayKey = selectedDay ? toKey(startOfDay(selectedDay)) : "";
  const savedDayNote = selectedDayKey ? (dayNotes[selectedDayKey] ?? "") : "";
  const holidayOnSelectedDay = selectedDayKey ? holidays[selectedDayKey] : undefined;

  const notedDates = useMemo(() => {
    const out: Record<string, boolean> = {};
    for (const [key, note] of Object.entries(dayNotes)) {
      if (note.trim()) out[key] = true;
    }
    return out;
  }, [dayNotes]);

  const hasSelectedDay = selectedDay !== null;

  useEffect(() => {
    const id = window.setTimeout(() => {
      const loaded = readCalendarNotes(STORAGE_KEY);
      setMonthNotes(loaded.monthNotes);
      setDayNotes(loaded.dayNotes);
      setStorageEpoch(1);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (storageEpoch === 0) return;
    const payload = { monthNotes, dayNotes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [monthNotes, dayNotes, storageEpoch]);

  const selectDay = useCallback(
    (day: Date, inCurrentMonth: boolean) => {
      if (!inCurrentMonth) return;
      const picked = startOfDay(day);
      setSelectedDay(picked);

      const start = rangeStart ? startOfDay(rangeStart) : null;
      const end = rangeEnd ? startOfDay(rangeEnd) : null;

      if (!start || (start && end)) {
        setRangeStart(picked);
        setRangeEnd(null);
        return;
      }

      if (picked.getTime() < start.getTime()) {
        setRangeEnd(start);
        setRangeStart(picked);
        return;
      }

      setRangeEnd(picked);
    },
    [rangeEnd, rangeStart],
  );

  const selectRangeByDrag = useCallback((start: Date, end: Date) => {
    const a = startOfDay(start);
    const b = startOfDay(end);
    if (a.getTime() <= b.getTime()) {
      setRangeStart(a);
      setRangeEnd(b);
      setSelectedDay(b);
      return;
    }
    setRangeStart(b);
    setRangeEnd(a);
    setSelectedDay(a);
  }, []);

  const saveMonthNote = useCallback(
    (value: string) => {
      setMonthNotes((prev) => ({ ...prev, [currentMonthId]: value }));
    },
    [currentMonthId],
  );

  const saveDayNote = useCallback(
    (value: string) => {
      if (!selectedDayKey) return;
      setDayNotes((prev) => ({ ...prev, [selectedDayKey]: value }));
    },
    [selectedDayKey],
  );

  const stepMonth = useCallback((delta: -1 | 1) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }, []);

  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  return {
    viewDate,
    days,
    heroImageUrl,
    holidays,
    notedDates,
    heading: formatMonthHeading(viewDate),
    startDate: rangeStart,
    endDate: rangeEnd,
    savedMonthNote,
    savedDayNote,
    monthEditorKey: `${currentMonthId}-${storageEpoch}`,
    dayEditorKey: `${selectedDayKey || "no-day"}-${storageEpoch}`,
    dayLabel: selectedDay ? formatShortLocalDate(startOfDay(selectedDay)) : "",
    hasDay: hasSelectedDay,
    activeHolidayName: holidayOnSelectedDay,
    isDarkTheme: nightMode,
    stepMonth,
    onDragRangeSelect: selectRangeByDrag,
    onSelectDay: selectDay,
    onClearRange: clearRange,
    onToggleTheme: () => setNightMode((prev) => !prev),
    onSaveMonthNotes: saveMonthNote,
    onSaveDayNotes: saveDayNote,
  };
}
