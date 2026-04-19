"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBeatState } from "@/components/beat/useBeatState";
import { MAX_BEAT } from "@/types/beat";

export function ScrollPrompt() {
  const t = useTranslations();
  const { current, hasInteracted, isTransitioning } = useBeatState();
  const visible = !hasInteracted && !isTransitioning && current < MAX_BEAT;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-prompt"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, delay: hasInteracted ? 0 : 1.8 }}
          className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 font-mono text-micro uppercase tracking-[0.32em]"
          style={{ color: "rgba(236,228,212,0.28)" }}
        >
          <motion.span
            animate={{ opacity: [0.28, 0.7, 0.28] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="block"
          >
            {t("scrollPrompt")}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
