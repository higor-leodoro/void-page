"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Bracket } from "@/components/primitives/Bracket";
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

export function RunningHead() {
  const t = useTranslations();
  const { current, jumpTo, isTransitioning } = useBeatState();

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.4 }}
      className="fixed inset-x-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-8 px-10 py-5 md:px-14 pt-14"
      style={{
        fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
        fontSize: "10.5px",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
      }}
      aria-label="Site header"
    >
      <div className="flex items-center gap-2.5 text-paper">
        <Image src="/logo-void-white.svg" alt="logo" width={30} height={10} />
        <span>{t("runningHead.brand")}</span>
      </div>

      <nav
        aria-label="Chapter navigation"
        className="flex items-center justify-center"
      >
        <ul className="flex items-center gap-x-8 font-mono text-[10.5px] uppercase tracking-[0.22em]">
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
                  <span className="text-[10px] text-paper-ghost">
                    {item.num}
                  </span>
                  <span
                    className={`transition-colors duration-220ms ease-out ${
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
                    className="pointer-events-none absolute right-0 -bottom-[2px] left-0 h-px"
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
      </nav>

      <div className="flex items-center justify-end gap-3">
        <LocaleSwitcher />
      </div>
    </motion.header>
  );
}
