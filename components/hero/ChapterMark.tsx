import { Bracket } from "@/components/primitives/Bracket";

type Props = {
  number: string;
  label: string;
  variant?: "hero" | "centered";
};

export function ChapterMark({ number, label, variant = "hero" }: Props) {
  if (variant === "centered") {
    return (
      <div className="flex items-center justify-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em]">
        <span className="text-paper-dim/60">
          <Bracket size="micro" />
        </span>
        <span className="text-paper-dim">{number}</span>
        <span aria-hidden className="text-paper-dim/40">·</span>
        <span className="text-paper">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em]">
      <span className="text-paper-dim/60">
        <Bracket size="micro" />
      </span>
      <span className="text-paper-dim">{number}</span>
      <span className="text-paper">{label}</span>
      <span
        aria-hidden
        className="h-px max-w-[140px] flex-1"
        style={{ background: "rgba(236,228,212,0.18)" }}
      />
    </div>
  );
}
