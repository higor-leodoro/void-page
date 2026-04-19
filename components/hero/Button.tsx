import { ArrowRight } from "lucide-react";

type Props = {
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
  withArrow?: boolean;
};

const CLIP =
  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))";

export function Button({ href, variant, children, withArrow }: Props) {
  if (variant === "primary") {
    return (
      <a
        href={href}
        className="group inline-flex items-center gap-2.5 bg-ultramarine px-7 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-paper transition-[background,transform,filter] duration-[400ms] ease-out hover:-translate-y-px hover:bg-[#3333E8] hover:[filter:drop-shadow(0_0_48px_rgba(43,43,194,0.45))]"
        style={{ clipPath: CLIP }}
      >
        {children}
        {withArrow !== false && (
          <ArrowRight
            size={13}
            strokeWidth={2}
            className="transition-transform duration-[400ms] ease-out group-hover:translate-x-1"
          />
        )}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="relative inline-flex items-center gap-2.5 px-7 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-paper transition-[background,box-shadow] duration-[400ms] ease-out hover:bg-paper/[0.04]"
      style={{
        clipPath: CLIP,
        boxShadow: "inset 0 0 0 1px rgba(236,228,212,0.28)",
      }}
    >
      {children}
    </a>
  );
}
