export type BeatId = 0 | 1 | 2 | 3 | 4 | 5;

export const BEAT_COUNT = 6;
export const MAX_BEAT: BeatId = 5;

export type BeatDirection = "forward" | "backward" | "none";

export const BEAT_TRANSITION_MS = 800;
export const BEAT_DEBOUNCE_MS = 600;

export interface BeatState {
  current: BeatId;
  previous: BeatId;
  direction: BeatDirection;
  isTransitioning: boolean;
  hasInteracted: boolean;
  advance: () => void;
  reverse: () => void;
  jumpTo: (beat: BeatId) => void;
}
