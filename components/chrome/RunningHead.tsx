"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Bracket } from "@/components/primitives/Bracket";
import { useBeatState } from "@/components/beat/useBeatState";

const FIGURE_KEYS: Record<number, string> = {
  0: "figureLabels.beat0",
  1: "figureLabels.beat1",
  2: "figureLabels.beat2",
  3: "figureLabels.beat3",
  4: "figureLabels.beat4",
  5: "figureLabels.beat5",
};

export function RunningHead() {
  const t = useTranslations();
  const { current } = useBeatState();

  const figureText = t(FIGURE_KEYS[current]);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.4 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 grid grid-cols-3 items-center px-8 py-5 md:px-12"
      style={{
        fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
        fontSize: "10.5px",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
      }}
    >
      <div className="flex items-center gap-2.5 text-paper">
        <Bracket size={13} />
        <span>{t("runningHead.brand")}</span>
      </div>
      <div
        className="text-center text-paper-dim"
        style={{ letterSpacing: "0.3em" }}
      >
        {t("runningHead.motto")}
      </div>
      <div
        className="relative flex h-[1em] items-center justify-end text-paper-dim"
        style={{ letterSpacing: "0.22em" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={figureText}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.28 }}
            className="absolute right-0"
          >
            {figureText}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
