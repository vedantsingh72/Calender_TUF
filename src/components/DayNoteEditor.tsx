import { useState } from "react";
import styles from "./NotesSection.module.css";

type DayNoteEditorProps = {
  dayLabel: string;
  enabled: boolean;
  savedNote: string;
  holidayName?: string;
  onSave: (value: string) => void;
};

export function DayNoteEditor({
  dayLabel,
  enabled,
  savedNote,
  holidayName,
  onSave,
}: DayNoteEditorProps) {
  const initialDraft =
    !savedNote.trim() && enabled && holidayName ? `Holiday: ${holidayName}` : savedNote;
  const [draft, setDraft] = useState(initialDraft);
  const isDirty = enabled && draft !== initialDraft;

  let saveLabel = "Save";
  if (enabled && savedNote.trim()) saveLabel = "Update";

  const placeholder = !enabled
    ? "Tap any day in the grid to attach notes."
    : holidayName
      ? `Holiday: ${holidayName}`
      : "Notes for this day...";

  return (
    <div className={styles.field}>
      <label htmlFor="day-note">
        <span className={styles.labelRow}>
          Day {enabled ? `(${dayLabel})` : "(tap a date)"}
          {isDirty ? <span className={styles.unsaved}>Unsaved</span> : null}
        </span>
        <textarea
          id="day-note"
          value={draft}
          disabled={!enabled}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          spellCheck
          suppressHydrationWarning
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
      </label>
      <button
        type="button"
        className={styles.saveButton}
        onClick={() => onSave(draft)}
        disabled={!enabled}
      >
        {saveLabel}
      </button>
    </div>
  );
}
