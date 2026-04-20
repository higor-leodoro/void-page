"use client";

import type { ReactNode } from "react";
import { useBeatState } from "@/components/beat/useBeatState";
import type { BeatId } from "@/types/beat";

type Props = {
  beats: BeatId | BeatId[];
  children: ReactNode;
};

export function BeatGate({ beats, children }: Props) {
  const { current } = useBeatState();
  const list = Array.isArray(beats) ? beats : [beats];
  if (!list.includes(current)) return null;
  return <>{children}</>;
}
