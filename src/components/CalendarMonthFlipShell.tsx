"use client";

import type { ReactNode } from "react";
import { useCalendarMonthFlip } from "@/hooks/useCalendarMonthFlip";
import flipStyles from "./CalendarMonthFlip.module.css";

type CalendarMonthFlipShellProps = {
  stepMonth: (delta: -1 | 1) => void;
  children: (requestFlip: (delta: -1 | 1) => void) => ReactNode;
};

export function CalendarMonthFlipShell({
  stepMonth,
  children,
}: CalendarMonthFlipShellProps) {
  const [flipRef, requestFlip, onTransitionEnd, flipStyle] =
    useCalendarMonthFlip(stepMonth);

  return (
    <div className={flipStyles.perspective}>
      <div
        ref={flipRef}
        className={flipStyles.flipInner}
        style={flipStyle}
        onTransitionEnd={onTransitionEnd}
      >
        {children(requestFlip)}
      </div>
    </div>
  );
}
