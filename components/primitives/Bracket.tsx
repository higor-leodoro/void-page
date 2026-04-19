type BracketSize = "micro" | "small" | "nav" | "hero";

const SIZE_PX: Record<BracketSize, number> = {
  micro: 10,
  small: 13,
  nav: 16,
  hero: 240,
};

type Props = {
  size?: BracketSize | number;
  className?: string;
};

export function Bracket({ size = "small", className }: Props) {
  const px = typeof size === "number" ? size : SIZE_PX[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M25.6 0V6.4L9.6 6.4C7.83 6.4 6.4 7.83 6.4 9.6L6.4 25.6H0L0 12.8L12.8 0L25.6 0Z"
        fill="currentColor"
      />
      <path
        d="M6.4 32L6.4 25.6L22.4 25.6C24.17 25.6 25.6 24.17 25.6 22.4L25.6 6.4L32 6.4L32 19.2L19.2 32H6.4Z"
        fill="currentColor"
      />
    </svg>
  );
}
