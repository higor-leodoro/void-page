"use client";

import { useContext } from "react";
import { BeatContext, type BeatContextValue } from "./BeatContext";

export function useBeatState(): BeatContextValue {
  const ctx = useContext(BeatContext);
  if (!ctx) {
    throw new Error("useBeatState must be used inside <BeatProvider>");
  }
  return ctx;
}
