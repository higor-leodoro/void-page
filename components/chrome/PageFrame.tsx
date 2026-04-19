import { CornerBracket } from "@/components/primitives/CornerBracket";

export function PageFrame() {
  return (
    <>
      <CornerBracket corner="tl" />
      <CornerBracket corner="tr" />
      <CornerBracket corner="bl" />
      <CornerBracket corner="br" />
    </>
  );
}
