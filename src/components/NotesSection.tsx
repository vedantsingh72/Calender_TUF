import { useState } from "react";
import styles from "./NotesSection.module.css";
import { SavedSnippet } from "./SavedSnippet";
import { DayNoteEditor } from "./DayNoteEditor";
import { MonthNoteEditor } from "./MonthNoteEditor";

type NotesSectionProps = {
  heading: string;
  dayLabel: string;
  hasDay: boolean;
  activeHolidayName?: string;
  savedMonthNote: string;
  savedDayNote: string;
  monthEditorKey: string;
  dayEditorKey: string;
  onSaveMonthNotes: (value: string) => void;
  onSaveDayNotes: (value: string) => void;
};

function mergeDayPreview(
  hasDay: boolean,
  savedDayNote: string,
  holidayName?: string,
): string {
  if (!hasDay) return "";
  const note = savedDayNote.trim();
  if (holidayName && note) return `Holiday: ${holidayName}\n${note}`;
  if (holidayName) return `Holiday: ${holidayName}`;
  return savedDayNote;
}

export function NotesSection({
  heading,
  dayLabel,
  hasDay,
  activeHolidayName,
  savedMonthNote,
  savedDayNote,
  monthEditorKey,
  dayEditorKey,
  onSaveMonthNotes,
  onSaveDayNotes,
}: NotesSectionProps) {
  const [openPanel, setOpenPanel] = useState<"month" | "day" | null>(null);
  const dayPreview = mergeDayPreview(hasDay, savedDayNote, activeHolidayName);

  function toggle(panel: "month" | "day"): void {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  return (
    <section className={styles.notesSection}>
      <div className={styles.tabBar}>
        <button
          type="button"
          className={`${styles.tab} ${openPanel === "month" ? styles.tabActive : ""}`}
          onClick={() => toggle("month")}
          aria-expanded={openPanel === "month"}
        >
          Month
        </button>
        <button
          type="button"
          className={`${styles.tab} ${openPanel === "day" ? styles.tabActive : ""}`}
          onClick={() => toggle("day")}
          aria-expanded={openPanel === "day"}
        >
          Day
        </button>
      </div>

      {openPanel === "month" ? (
        <div className={styles.panel}>
          <p className={styles.panelMeta}>{heading}</p>
          <SavedSnippet text={savedMonthNote} />
          <MonthNoteEditor
            key={monthEditorKey}
            savedNote={savedMonthNote}
            onSave={onSaveMonthNotes}
          />
        </div>
      ) : null}

      {openPanel === "day" ? (
        <div className={styles.panel}>
          <p className={styles.panelMeta}>
            {hasDay ? dayLabel : "Choose a date on the calendar"}
          </p>
          <SavedSnippet text={dayPreview} />
          <DayNoteEditor
            key={dayEditorKey}
            dayLabel={dayLabel}
            enabled={hasDay}
            savedNote={savedDayNote}
            holidayName={activeHolidayName}
            onSave={onSaveDayNotes}
          />
        </div>
      ) : null}
    </section>
  );
}
