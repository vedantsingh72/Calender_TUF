import styles from "./NotesSection.module.css";

type SavedSnippetProps = {
  text: string;
};

export function SavedSnippet({ text }: SavedSnippetProps) {
  const trimmed = text.trim();
  const preview = trimmed.length > 100 ? `${trimmed.slice(0, 100)}…` : trimmed;
  return (
    <p className={styles.savedSnippet} title={trimmed || undefined}>
      <span className={styles.savedSnippetLabel}>Saved</span>
      <span className={styles.savedSnippetText}>{preview || "—"}</span>
    </p>
  );
}
