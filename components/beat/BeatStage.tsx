"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HeroStack } from "@/components/hero/HeroStack";
import { PlaceholderBeat } from "./PlaceholderBeat";
import { useBeatState } from "./useBeatState";
import type { BeatId } from "@/types/beat";

const EASE = [0.16, 1, 0.3, 1] as const;

export function BeatStage() {
  const { current, direction } = useBeatState();
  const goingForward = direction !== "backward";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{
          opacity: 0,
          y: goingForward ? 32 : -32,
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE },
        }}
        exit={{
          opacity: 0,
          y: goingForward ? -32 : 32,
          transition: { duration: 0.28, ease: EASE },
        }}
      >
        {current === 0 ? (
          <HeroStack />
        ) : (
          <PlaceholderBeat beat={current as Exclude<BeatId, 0>} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
