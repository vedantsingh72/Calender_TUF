import styles from "./HangingCalendar.module.css";
import {
  CalendarDay,
  formatMonthLong,
  formatShortLocalDate,
  startOfDay,
} from "@/lib/calendar";
import { CalendarMonthFlipShell } from "./CalendarMonthFlipShell";
import { DayRangeSelector } from "./DayRangeSelector";
import { HeroPanel } from "./HeroPanel";
import { NotesSection } from "./NotesSection";

export type HangingCalendarProps = {
  viewDate: Date;
  heading: string;
  heroImageUrl: string;
  days: CalendarDay[];
  holidays: Record<string, string>;
  notedDates: Record<string, boolean>;
  startDate: Date | null;
  endDate: Date | null;
  savedMonthNote: string;
  savedDayNote: string;
  monthEditorKey: string;
  dayEditorKey: string;
  dayLabel: string;
  hasDay: boolean;
  activeHolidayName?: string;
  isDarkTheme: boolean;
  stepMonth: (delta: -1 | 1) => void;
  onDragRangeSelect: (start: Date, end: Date) => void;
  onSelectDay: (date: Date, inCurrentMonth: boolean) => void;
  onClearRange: () => void;
  onToggleTheme: () => void;
  onSaveMonthNotes: (value: string) => void;
  onSaveDayNotes: (value: string) => void;
};

function statusBannerText(
  hasDay: boolean,
  startDate: Date | null,
  endDate: Date | null,
  dayLabel: string,
  activeHolidayName: string | undefined,
  savedDayNote: string,
): string {
  if (!hasDay) {
    if (!startDate) {
      return "Tap any date to see holiday and note details here.";
    }
    if (!endDate) {
      return `Range start selected: ${formatShortLocalDate(startOfDay(startDate))}.`;
    }
    return `Range selected: ${formatShortLocalDate(startOfDay(startDate))} – ${formatShortLocalDate(startOfDay(endDate))}.`;
  }

  const chunks = [`Date: ${dayLabel}`];
  if (activeHolidayName) chunks.push(`Holiday: ${activeHolidayName}`);
  chunks.push(
    savedDayNote.trim() ? `Note: ${savedDayNote}` : "Note: No day note saved yet.",
  );
  return chunks.join("  |  ");
}

export function HangingCalendar({
  viewDate,
  heading,
  heroImageUrl,
  days,
  holidays,
  notedDates,
  startDate,
  endDate,
  savedMonthNote,
  savedDayNote,
  monthEditorKey,
  dayEditorKey,
  dayLabel,
  hasDay,
  activeHolidayName,
  isDarkTheme,
  stepMonth,
  onDragRangeSelect,
  onSelectDay,
  onClearRange,
  onToggleTheme,
  onSaveMonthNotes,
  onSaveDayNotes,
}: HangingCalendarProps) {
  const monthLabel = formatMonthLong(viewDate);

  return (
    <main className={styles.calendarPaper}>
      <CalendarMonthFlipShell stepMonth={stepMonth}>
        {(requestFlip) => (
          <>
            <HeroPanel
              month={monthLabel}
              year={viewDate.getFullYear()}
              imageUrl={heroImageUrl}
            />

            <section className={styles.content}>
              <header className={styles.headerRow}>
                <button
                  type="button"
                  onClick={() => requestFlip(-1)}
                  className={styles.navButton}
                  aria-label="Previous month"
                >
                  ←
                </button>
                <h1>{heading}</h1>
                <button
                  type="button"
                  onClick={() => requestFlip(1)}
                  className={styles.navButton}
                  aria-label="Next month"
                >
                  →
                </button>
              </header>

              <p className={styles.rangeHint}>
                {statusBannerText(
                  hasDay,
                  startDate,
                  endDate,
                  dayLabel,
                  activeHolidayName,
                  savedDayNote,
                )}
              </p>

              <DayRangeSelector
                days={days}
                holidays={holidays}
                notedDates={notedDates}
                startDate={startDate}
                endDate={endDate}
                onDragRangeSelect={onDragRangeSelect}
                onSwipePrevMonth={() => requestFlip(-1)}
                onSwipeNextMonth={() => requestFlip(1)}
                onSelectDay={onSelectDay}
              />

              <div className={styles.actions}>
                <button type="button" onClick={onClearRange}>
                  Clear range
                </button>
                <button type="button" onClick={onToggleTheme}>
                  {isDarkTheme ? "Theme: Night" : "Theme: Paper"}
                </button>
              </div>
            </section>
          </>
        )}
      </CalendarMonthFlipShell>

      <section className={styles.notesWrap}>
        <NotesSection
          heading={heading}
          dayLabel={dayLabel}
          hasDay={hasDay}
          activeHolidayName={activeHolidayName}
          savedMonthNote={savedMonthNote}
          savedDayNote={savedDayNote}
          monthEditorKey={monthEditorKey}
          dayEditorKey={dayEditorKey}
          onSaveMonthNotes={onSaveMonthNotes}
          onSaveDayNotes={onSaveDayNotes}
        />
      </section>
    </main>
  );
}
