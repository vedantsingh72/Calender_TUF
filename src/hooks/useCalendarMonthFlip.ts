"use client";

import type { CSSProperties, RefObject, TransitionEvent } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const HALF_FLIP_MS = 360;

export type MonthFlipPhase = "idle" | "out" | "in";

// Month flip: `onStepMonth` runs in a microtask so parent state never updates
// during this component's setState; transitionend is deduped so months don't skip.
export function useCalendarMonthFlip(
  onStepMonth: (delta: -1 | 1) => void,
): [
  RefObject<HTMLDivElement | null>,
  (delta: -1 | 1) => void,
  (event: TransitionEvent<HTMLDivElement>) => void,
  CSSProperties,
] {
  const [phase, setPhase] = useState<MonthFlipPhase>("idle");
  const [direction, setDirection] = useState<-1 | 1>(1);
  const flipRef = useRef<HTMLDivElement | null>(null);
  const directionRef = useRef<-1 | 1>(1);
  const phaseRef = useRef<MonthFlipPhase>("idle");
  const outHalfCommittedRef = useRef(false);
  const pendingMonthStepRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const requestFlip = useCallback((delta: -1 | 1) => {
    if (phaseRef.current !== "idle") return;
    outHalfCommittedRef.current = false;
    directionRef.current = delta;
    phaseRef.current = "out";
    setDirection(delta);
    setPhase("out");
  }, []);

  useLayoutEffect(() => {
    if (phase !== "in") return;
    const el = flipRef.current;
    if (!el) return;

    const d = directionRef.current;
    el.style.transition = "none";
    el.style.transform = `rotateY(${90 * d}deg)`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${HALF_FLIP_MS}ms cubic-bezier(0.32, 0.72, 0.24, 1)`;
        el.style.transform = "rotateY(0deg)";
      });
    });
  }, [phase]);

  const onTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      if (event.propertyName !== "transform") return;

      setPhase((current) => {
        if (current === "out") {
          if (outHalfCommittedRef.current) {
            return "in";
          }
          outHalfCommittedRef.current = true;
          phaseRef.current = "in";
          pendingMonthStepRef.current = true;
          return "in";
        }
        if (current === "in") {
          outHalfCommittedRef.current = false;
          phaseRef.current = "idle";
          const el = flipRef.current;
          if (el) {
            el.style.transition = "none";
            el.style.transform = "";
          }
          return "idle";
        }
        return current;
      });

      queueMicrotask(() => {
        if (!pendingMonthStepRef.current) return;
        pendingMonthStepRef.current = false;
        onStepMonth(directionRef.current);
      });
    },
    [onStepMonth],
  );

  const easing = `transform ${HALF_FLIP_MS}ms cubic-bezier(0.32, 0.72, 0.24, 1)`;

  const style: CSSProperties =
    phase === "out"
      ? {
          transform: `rotateY(${-90 * direction}deg)`,
          transition: easing,
          pointerEvents: "none",
        }
      : phase === "in"
        ? { pointerEvents: "none" }
        : {};

  return [flipRef, requestFlip, onTransitionEnd, style];
}
