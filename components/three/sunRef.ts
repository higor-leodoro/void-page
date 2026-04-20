"use client";

import { createContext, useContext } from "react";
import type { RefObject } from "react";
import type { Mesh } from "three";

export type SunRef = RefObject<Mesh | null>;

export const SunRefContext = createContext<SunRef | null>(null);

export function useSunRef() {
  return useContext(SunRefContext);
}

export type SunScreenSample = {
  x: number;
  y: number;
  r: number;
  visible: boolean;
};

export type SunScreenRef = RefObject<SunScreenSample>;

export const SunScreenContext = createContext<SunScreenRef | null>(null);

export function useSunScreen() {
  return useContext(SunScreenContext);
}
