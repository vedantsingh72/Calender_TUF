import type { TouchEvent } from "react";
import styles from "./DayRangeSelector.module.css";

type CalendarDayCellProps = {
  dateKey: string;
  dayOfMonth: number;
  disabled: boolean;
  holidayName?: string;
  cellClassName: string;
  showHolidayDot: boolean;
  showNoteSticky: boolean;
  onPointerPick: () => void;
  onBeginDrag: () => void;
  onContinueDrag: () => void;
  onLongPressArm: () => void;
  onLongPressMove: (event: TouchEvent<HTMLButtonElement>) => void;
  onLongPressEnd: () => void;
};

export function CalendarDayCell({
  dateKey,
  dayOfMonth,
  disabled,
  holidayName,
  cellClassName,
  showHolidayDot,
  showNoteSticky,
  onPointerPick,
  onBeginDrag,
  onContinueDrag,
  onLongPressArm,
  onLongPressMove,
  onLongPressEnd,
}: CalendarDayCellProps) {
  return (
    <button
      type="button"
      role="gridcell"
      data-day-key={dateKey}
      disabled={disabled}
      aria-disabled={disabled}
      title={holidayName ?? undefined}
      aria-label={holidayName ? `${dayOfMonth} ${holidayName}` : `Date ${dayOfMonth}`}
      className={cellClassName}
      onClick={onPointerPick}
      onMouseDown={onBeginDrag}
      onMouseEnter={onContinueDrag}
      onTouchStart={onLongPressArm}
      onTouchMove={onLongPressMove}
      onTouchEnd={onLongPressEnd}
    >
      <span className={styles.dayNum}>{dayOfMonth}</span>
      {showHolidayDot ? <span className={styles.holidayDot} aria-hidden /> : null}
      {showNoteSticky ? (
        <span className={styles.noteSticky} aria-hidden>
          <span className={styles.noteFold} />
        </span>
      ) : null}
    </button>
  );
}
