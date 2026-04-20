"use client";

import { createContext, useContext } from "react";
import type { RefObject } from "react";
import type { Mesh } from "three";

export type SphereRef = RefObject<Mesh | null>;

export const SphereRefContext = createContext<SphereRef | null>(null);

export function useSphereRef() {
  return useContext(SphereRefContext);
}
