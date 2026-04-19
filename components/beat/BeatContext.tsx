"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BeatDirection, BeatId } from "@/types/beat";
import { MAX_BEAT } from "@/types/beat";

type InternalState = {
  current: BeatId;
  previous: BeatId;
  direction: BeatDirection;
  isTransitioning: boolean;
  hasInteracted: boolean;
};

export type BeatContextValue = InternalState & {
  cameraProgressRef: React.MutableRefObject<{ value: number }>;
  advance: () => void;
  reverse: () => void;
  jumpTo: (beat: BeatId) => void;
  setTransitionComplete: () => void;
};

const initialState: InternalState = {
  current: 0,
  previous: 0,
  direction: "none",
  isTransitioning: false,
  hasInteracted: false,
};

export const BeatContext = createContext<BeatContextValue | null>(null);

type Target = BeatId | "next" | "prev";

export function BeatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InternalState>(initialState);
  const cameraProgressRef = useRef<{ value: number }>({ value: 0 });

  const change = useCallback((target: Target) => {
    setState((s) => {
      if (s.isTransitioning) return s;
      let next: BeatId;
      if (target === "next") {
        if (s.current >= MAX_BEAT) return s;
        next = (s.current + 1) as BeatId;
      } else if (target === "prev") {
        if (s.current <= 0) return s;
        next = (s.current - 1) as BeatId;
      } else {
        if (target < 0 || target > MAX_BEAT) return s;
        next = target;
      }
      if (next === s.current) return s;
      cameraProgressRef.current.value = 0;
      return {
        current: next,
        previous: s.current,
        direction: next > s.current ? "forward" : "backward",
        isTransitioning: true,
        hasInteracted: true,
      };
    });
  }, []);

  const advance = useCallback(() => change("next"), [change]);
  const reverse = useCallback(() => change("prev"), [change]);
  const jumpTo = useCallback(
    (beat: BeatId) => change(beat),
    [change],
  );

  const setTransitionComplete = useCallback(() => {
    setState((s) =>
      s.isTransitioning
        ? { ...s, isTransitioning: false, direction: "none" }
        : s,
    );
  }, []);

  const value = useMemo<BeatContextValue>(
    () => ({
      ...state,
      cameraProgressRef,
      advance,
      reverse,
      jumpTo,
      setTransitionComplete,
    }),
    [state, advance, reverse, jumpTo, setTransitionComplete],
  );

  return (
    <BeatContext.Provider value={value}>{children}</BeatContext.Provider>
  );
}
