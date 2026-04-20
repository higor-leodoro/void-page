"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChapterMark } from "./ChapterMark";
import { Button } from "./Button";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroStack() {
  const t = useTranslations();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-8 pb-20 md:px-12 md:pb-24">
      <div className="pointer-events-auto max-w-[760px]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
          className="mb-8"
        >
          <ChapterMark
            number={t("chapter.number")}
            label={t("chapter.studioLabel")}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.9, ease: EASE }}
          className="font-display font-black leading-[0.96] text-paper uppercase"
          style={{
            fontSize: "clamp(44px, 5.8vw, 88px)",
            letterSpacing: "-0.025em",
          }}
        >
          {t("headline.before")}{" "}
          <span
            className="text-ultramarine"
            style={{
              textShadow:
                "0 0 40px rgba(43,43,194,0.45), 0 0 80px rgba(43,43,194,0.2)",
            }}
          >
            {t("headline.accent")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 1.1, ease: EASE }}
          className="mt-8 max-w-[48ch] font-display text-[17px] font-light leading-[1.55] text-paper-dim"
        >
          {t("sub.part1")}{" "}
          <span className="font-medium text-paper">{t("sub.part2")}</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
          className="mt-5 max-w-[46ch] font-display text-[13.5px] font-light leading-[1.65]"
          style={{ color: "rgba(236,228,212,0.48)" }}
        >
          {t("detail")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button href="#demos" variant="primary" withArrow>
            {t("cta.primary")}
          </Button>
          <Button href="#contact" variant="secondary">
            {t("cta.secondary")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
