"use client";

import { forwardRef } from "react";
import type { OrbitSlot as OrbitSlotData } from "./beatChoreography";
import { PLACEHOLDER_CONTENT } from "./beatChoreography";

type Props = {
  slot: OrbitSlotData;
};

export const OrbitSlot = forwardRef<HTMLElement, Props>(function OrbitSlot(
  { slot },
  ref,
) {
  const placeholder = PLACEHOLDER_CONTENT[slot.id];
  const align = slot.align ?? "start";
  const textAlign =
    align === "center" ? "center" : align === "end" ? "right" : "left";

  return (
    <article
      ref={ref as React.Ref<HTMLElement>}
      data-orbit-slot={slot.id}
      aria-labelledby={`${slot.id}-label`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: slot.width ?? "24ch",
        maxWidth: "40vw",
        textAlign,
        opacity: 0,
        pointerEvents: "auto",
        willChange: "transform, opacity",
        // Custom props consumed by useOrbitTransition via CSS var readback
      }}
      data-radius={slot.radius}
      data-angle={slot.angle}
    >
      {placeholder?.kicker ? (
        <div
          id={`${slot.id}-label`}
          className="text-[10px] tracking-[0.3em] uppercase text-white/45 mb-1"
        >
          {placeholder.kicker}
        </div>
      ) : null}
      {placeholder?.body ? (
        <p className="text-[15px] leading-snug text-white/85">
          {placeholder.body}
        </p>
      ) : null}
    </article>
  );
});
