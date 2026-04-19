"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBeatState } from "@/components/beat/useBeatState";
import { LocaleSwitcher } from "./LocaleSwitcher";
import type { BeatId } from "@/types/beat";

const ITEMS: ReadonlyArray<{ id: BeatId; num: string; key: string }> = [
  { id: 0, num: "00", key: "nav.item00" },
  { id: 1, num: "01", key: "nav.item01" },
  { id: 2, num: "02", key: "nav.item02" },
  { id: 3, num: "03", key: "nav.item03" },
  { id: 4, num: "04", key: "nav.item04" },
  { id: 5, num: "05", key: "nav.item05" },
];

export function ChapterNav() {
  const t = useTranslations();
  const { current, jumpTo, isTransitioning } = useBeatState();

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.55 }}
      className="fixed left-0 right-0 top-[56px] z-40 flex items-center justify-between px-8 md:px-12"
      aria-label="Chapter navigation"
    >
      <ul className="flex flex-wrap items-center gap-x-9 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.22em]">
        {ITEMS.map((item) => {
          const active = item.id === current;
          return (
            <li key={item.id} className="relative">
              <button
                type="button"
                onClick={() => jumpTo(item.id)}
                disabled={isTransitioning}
                className="group flex items-center gap-2 py-2 disabled:cursor-default"
                aria-current={active ? "true" : undefined}
              >
                <span className="text-[10px] text-paper-ghost">{item.num}</span>
                <span
                  className={`transition-colors duration-[220ms] ease-out ${
                    active
                      ? "text-ultramarine"
                      : "text-paper-dim group-hover:text-paper"
                  }`}
                >
                  {t(item.key)}
                </span>
              </button>
              {active && (
                <motion.span
                  layoutId="chapter-nav-underline"
                  className="pointer-events-none absolute left-0 right-0 -bottom-[2px] h-px"
                  style={{
                    background: "var(--color-ultramarine)",
                    marginLeft: "26px",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 38,
                    mass: 0.9,
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-3">
        <span aria-hidden className="text-paper-ghost">·</span>
        <LocaleSwitcher />
      </div>
    </motion.nav>
  );
}
