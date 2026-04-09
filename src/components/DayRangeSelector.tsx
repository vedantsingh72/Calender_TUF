import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./DayRangeSelector.module.css";
import { CalendarDayCell } from "./CalendarDayCell";
import {
  CalendarDay,
  isDateInInclusiveRange,
  isSameDate,
  startOfDay,
  toKey,
} from "@/lib/calendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayRangeSelectorProps = {
  days: CalendarDay[];
  startDate: Date | null;
  endDate: Date | null;
  holidays: Record<string, string>;
  notedDates: Record<string, boolean>;
  onDragRangeSelect: (start: Date, end: Date) => void;
  onSwipePrevMonth: () => void;
  onSwipeNextMonth: () => void;
  onSelectDay: (date: Date, inCurrentMonth: boolean) => void;
};

export function DayRangeSelector({
  days,
  startDate,
  endDate,
  holidays,
  notedDates,
  onDragRangeSelect,
  onSwipePrevMonth,
  onSwipeNextMonth,
  onSelectDay,
}: DayRangeSelectorProps) {
  const today = new Date();
  const resolvedStart = startDate && endDate ? startOfDay(startDate) : null;
  const resolvedEnd = startDate && endDate ? startOfDay(endDate) : null;

  const [dragAnchor, setDragAnchor] = useState<Date | null>(null);
  const [longPressMode, setLongPressMode] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const suppressClickUntil = useRef(0);
  const swipeOrigin = useRef<{ x: number; y: number } | null>(null);

  const daysByKey = useMemo(() => {
    const map = new Map<string, Date>();
    for (const { date, inCurrentMonth } of days) {
      if (!inCurrentMonth) continue;
      const normalized = startOfDay(date);
      map.set(toKey(normalized), normalized);
    }
    return map;
  }, [days]);

  useEffect(() => {
    if (!dragAnchor) return;
    const endDrag = () => setDragAnchor(null);
    window.addEventListener("mouseup", endDrag);
    return () => window.removeEventListener("mouseup", endDrag);
  }, [dragAnchor]);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    };
  }, []);

  function cancelLongPress(): void {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setLongPressMode(false);
    setDragAnchor(null);
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div
        className={styles.grid}
        role="grid"
        aria-label="Calendar dates"
        onTouchStart={(event) => {
          const t = event.touches[0];
          swipeOrigin.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(event) => {
          if (!swipeOrigin.current || longPressMode) {
            swipeOrigin.current = null;
            cancelLongPress();
            return;
          }
          const t = event.changedTouches[0];
          const dx = t.clientX - swipeOrigin.current.x;
          const dy = t.clientY - swipeOrigin.current.y;
          if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            if (dx < 0) onSwipeNextMonth();
            if (dx > 0) onSwipePrevMonth();
          }
          swipeOrigin.current = null;
        }}
      >
        {days.map(({ date, inCurrentMonth }, index) => {
          const day = startOfDay(date);
          const prevDay = index > 0 ? startOfDay(days[index - 1].date) : null;
          const nextDay =
            index < days.length - 1 ? startOfDay(days[index + 1].date) : null;

          const insideRange =
            inCurrentMonth &&
            resolvedStart !== null &&
            resolvedEnd !== null &&
            isDateInInclusiveRange(day, resolvedStart, resolvedEnd);

          const prevInsideRange =
            prevDay !== null &&
            resolvedStart !== null &&
            resolvedEnd !== null &&
            isDateInInclusiveRange(prevDay, resolvedStart, resolvedEnd);

          const nextInsideRange =
            nextDay !== null &&
            resolvedStart !== null &&
            resolvedEnd !== null &&
            isDateInInclusiveRange(nextDay, resolvedStart, resolvedEnd);

          const segmentLeft = insideRange && !prevInsideRange;
          const segmentRight = insideRange && !nextInsideRange;

          const pendingStartOnly =
            inCurrentMonth &&
            startDate &&
            !endDate &&
            isSameDate(day, startOfDay(startDate));

          const isRangeStart =
            insideRange &&
            resolvedStart !== null &&
            day.getTime() === resolvedStart.getTime();
          const isRangeEnd =
            insideRange &&
            resolvedEnd !== null &&
            day.getTime() === resolvedEnd.getTime();
          const isRangeMiddle = insideRange && !isRangeStart && !isRangeEnd;

          const isToday = isSameDate(date, today);
          const dateKey = toKey(day);
          const holidayName = inCurrentMonth ? holidays[dateKey] : undefined;
          const onHoliday = Boolean(holidayName);
          const hasNote = inCurrentMonth && Boolean(notedDates[dateKey]);

          const cellClass = [
            styles.dayCell,
            inCurrentMonth ? "" : styles.outsideMonth,
            pendingStartOnly ? styles.pendingStart : "",
            onHoliday ? styles.holiday : "",
            insideRange ? styles.inRangeRun : "",
            segmentLeft ? styles.segmentLeft : "",
            segmentRight ? styles.segmentRight : "",
            isRangeStart || isRangeEnd ? styles.rangeEndpoint : "",
            isRangeMiddle ? styles.rangeMiddle : "",
            prevInsideRange && insideRange ? styles.joinLeft : "",
            nextInsideRange && insideRange ? styles.joinRight : "",
            isToday ? styles.today : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <CalendarDayCell
              key={`${toKey(date)}-${index}`}
              dateKey={dateKey}
              dayOfMonth={date.getDate()}
              disabled={!inCurrentMonth}
              holidayName={holidayName}
              cellClassName={cellClass}
              showHolidayDot={onHoliday}
              showNoteSticky={hasNote}
              onPointerPick={() => {
                if (Date.now() < suppressClickUntil.current) return;
                onSelectDay(date, inCurrentMonth);
              }}
              onBeginDrag={() => {
                if (!inCurrentMonth) return;
                const base = startOfDay(date);
                setDragAnchor(base);
                onDragRangeSelect(base, base);
              }}
              onContinueDrag={() => {
                if (!inCurrentMonth || !dragAnchor) return;
                onDragRangeSelect(dragAnchor, startOfDay(date));
              }}
              onLongPressArm={() => {
                if (!inCurrentMonth) return;
                const base = startOfDay(date);
                if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
                longPressTimer.current = window.setTimeout(() => {
                  setLongPressMode(true);
                  setDragAnchor(base);
                  onDragRangeSelect(base, base);
                  suppressClickUntil.current = Date.now() + 450;
                }, 380);
              }}
              onLongPressMove={(event) => {
                if (!longPressMode || !dragAnchor) return;
                const t = event.touches[0];
                const el = document.elementFromPoint(t.clientX, t.clientY);
                const btn = el?.closest("[data-day-key]") as HTMLElement | null;
                const key = btn?.getAttribute("data-day-key");
                if (!key) return;
                const target = daysByKey.get(key);
                if (!target) return;
                onDragRangeSelect(dragAnchor, target);
              }}
              onLongPressEnd={() => {
                if (!longPressMode) {
                  if (longPressTimer.current) {
                    window.clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                  }
                  return;
                }
                cancelLongPress();
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
