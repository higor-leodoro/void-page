import type { ReactNode } from "react";
import type { BeatId } from "@/types/beat";

export type OrbitSlot = {
  id: string;
  radius: number;
  angle: number;
  content: ReactNode;
  width?: string;
  align?: "start" | "center" | "end";
  enterFrom?: number;
  exitTo?: number;
};

export type BeatLayout = {
  slots: OrbitSlot[];
};

const kicker = (n: string, title: string) => ({
  kicker: n,
  title,
});

const placeholderKicker = (num: string, label: string): ReactNode => ({
  type: "div",
  props: {
    className: "flex flex-col gap-2 max-w-[28ch]",
    children: [
      {
        type: "span",
        props: {
          className: "text-[10px] tracking-[0.3em] uppercase text-white/45",
          children: num,
        },
      },
      {
        type: "p",
        props: {
          className: "text-[15px] leading-snug text-white/85",
          children: label,
        },
      },
    ],
  },
}) as unknown as ReactNode;

void kicker;
void placeholderKicker;

export const BEAT_LAYOUTS: Record<BeatId, BeatLayout> = {
  0: {
    slots: [
      {
        id: "b0-intro",
        radius: 0.35,
        angle: 180,
        width: "28ch",
        align: "start",
        content: null,
      },
    ],
  },
  1: {
    slots: [
      {
        id: "b1-main",
        radius: 0.3,
        angle: 150,
        width: "26ch",
        align: "start",
        content: null,
      },
      {
        id: "b1-aside",
        radius: 0.2,
        angle: 330,
        width: "18ch",
        align: "start",
        content: null,
      },
    ],
  },
  2: {
    slots: [
      {
        id: "b2-arg",
        radius: 0.35,
        angle: 120,
        width: "28ch",
        align: "start",
        content: null,
      },
      {
        id: "b2-counter",
        radius: 0.25,
        angle: 300,
        width: "22ch",
        align: "start",
        content: null,
      },
    ],
  },
  3: {
    slots: [
      {
        id: "b3-top",
        radius: 0.3,
        angle: 90,
        width: "20ch",
        align: "center",
        content: null,
      },
      {
        id: "b3-right",
        radius: 0.3,
        angle: 330,
        width: "20ch",
        align: "start",
        content: null,
      },
      {
        id: "b3-left",
        radius: 0.3,
        angle: 210,
        width: "20ch",
        align: "start",
        content: null,
      },
    ],
  },
  4: {
    slots: [
      { id: "b4-0", radius: 0.28, angle: 0, width: "14ch", content: null },
      { id: "b4-60", radius: 0.28, angle: 60, width: "14ch", content: null },
      { id: "b4-120", radius: 0.28, angle: 120, width: "14ch", content: null },
      { id: "b4-180", radius: 0.28, angle: 180, width: "14ch", content: null },
      { id: "b4-240", radius: 0.28, angle: 240, width: "14ch", content: null },
      { id: "b4-300", radius: 0.28, angle: 300, width: "14ch", content: null },
    ],
  },
  5: {
    slots: [
      {
        id: "b5-cta",
        radius: 0.3,
        angle: 180,
        width: "30ch",
        align: "start",
        content: null,
      },
    ],
  },
};

// Placeholder PT content — injected at render time to keep file JSX-free.
export const PLACEHOLDER_CONTENT: Record<string, { kicker: string; body: string }> = {
  "b0-intro": { kicker: "§ 001 · ESTÚDIO IA-NATIVO", body: "Software sob medida, arquitetado em vez de montado." },
  "b1-main": { kicker: "§ 002 · DIAGNÓSTICO", body: "Seu stack foi montado peça por peça. Nunca foi pensado como um sistema." },
  "b1-aside": { kicker: "nota", body: "Integrações viraram dívida." },
  "b2-arg": { kicker: "§ 003 · TESE", body: "Um arquiteto desenha o todo antes da primeira linha. IA executa. Humano decide." },
  "b2-counter": { kicker: "contraprova", body: "Sem arquitetura, IA acelera o caos." },
  "b3-top": { kicker: "princípio", body: "Intenção declarada." },
  "b3-right": { kicker: "princípio", body: "Decisões rastreáveis." },
  "b3-left": { kicker: "princípio", body: "Código como consequência." },
  "b4-0": { kicker: "", body: "Logística" },
  "b4-60": { kicker: "", body: "Manufatura" },
  "b4-120": { kicker: "", body: "Energia" },
  "b4-180": { kicker: "", body: "Saúde" },
  "b4-240": { kicker: "", body: "Finanças" },
  "b4-300": { kicker: "", body: "Governo" },
  "b5-cta": { kicker: "§ 004 · CONVITE", body: "Se você precisa de um sistema real — fale com a gente." },
};
