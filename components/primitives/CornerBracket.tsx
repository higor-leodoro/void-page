type Corner = "tl" | "tr" | "bl" | "br";

type Props = {
  corner: Corner;
  size?: number;
};

const ROTATION: Record<Corner, number> = {
  tl: 0,
  tr: 90,
  br: 180,
  bl: 270,
};

const POSITION: Record<Corner, string> = {
  tl: "top-6 left-6",
  tr: "top-6 right-6",
  bl: "bottom-6 left-6",
  br: "bottom-6 right-6",
};

export function CornerBracket({ corner, size = 28 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none fixed ${POSITION[corner]} z-20 text-paper-dim/55`}
      style={{ transform: `rotate(${ROTATION[corner]}deg)` }}
    >
      <path
        d="M1 11 L1 1 L11 1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
      <path
        d="M5 1 L1 5"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.55"
      />
    </svg>
  );
}
