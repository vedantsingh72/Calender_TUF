import { useState } from "react";
import styles from "./NotesSection.module.css";

type MonthNoteEditorProps = {
  savedNote: string;
  onSave: (value: string) => void;
};

export function MonthNoteEditor({ savedNote, onSave }: MonthNoteEditorProps) {
  const [draft, setDraft] = useState(savedNote);
  const dirty = draft !== savedNote;

  return (
    <div className={styles.field}>
      <label htmlFor="month-note">
        <span className={styles.labelRow}>
          Draft
          {dirty ? <span className={styles.unsaved}>Unsaved</span> : null}
        </span>
        <textarea
          id="month-note"
          value={draft}
          placeholder="Draft reminders for this month..."
          onChange={(event) => setDraft(event.target.value)}
          spellCheck
          suppressHydrationWarning
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
      </label>
      <button type="button" className={styles.saveButton} onClick={() => onSave(draft)}>
        {savedNote.trim() ? "Update" : "Save"}
      </button>
    </div>
  );
}
