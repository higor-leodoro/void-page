"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChapterMark } from "@/components/hero/ChapterMark";
import type { BeatId } from "@/types/beat";

const EASE = [0.16, 1, 0.3, 1] as const;

const LABEL_KEYS: Record<Exclude<BeatId, 0>, string> = {
  1: "nav.item01",
  2: "nav.item02",
  3: "nav.item03",
  4: "nav.item04",
  5: "nav.item05",
};

type Props = { beat: Exclude<BeatId, 0> };

export function PlaceholderBeat({ beat }: Props) {
  const t = useTranslations();
  const number = `§ 00${beat}`;
  const label = t(LABEL_KEYS[beat]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      >
        <ChapterMark number={number} label={label} variant="centered" />
      </motion.div>
    </div>
  );
}
