# Plan — Hero Section + Beat System (Void · Genesis)

## Context

Starting the **hero section** implementation in the `void-page/` project (Next.js 16.2.4 + React 19 + Tailwind v4 + next-intl), following the locked specs in HERO.md and DESIGN_SYSTEM.md. To exercise the scroll mechanic, we also build placeholders for chapters `01–05` inside the same page (single-page architecture, Lusion-style).

- **Design source**: `void-page/docs/HERO.md` is normative. Copy is locked verbatim in `locales/{en,pt}.json`.
- **Primary reference**: `https://client-zero-tech.lusion.co/` — "scroll = camera through a persistent space, one input = one discrete beat". Screenshots at `void-genesis-web/references/lusion-*.jpeg` (7 beats mapped).
- **DOM/animation reference**: `void-genesis-web/src/components/sections/hero.tsx` — entry timings (400/650/900/1100/1300/1500ms) already validated; we port them. The italic-serif headline treatment is retired (HERO.md §2.4.2 lock).
- **Current `void-page` state**: trivial demo in `page.tsx`; no `/components/`; Inter loaded without weight 900; framer-motion and GSAP not installed.

**Target outcome**: a first navigable render with the full hero (copy + chrome + breathing 3D placeholder) and 5 placeholder beats (centered title) reachable via wheel/touch/keyboard/chapter-nav, in both PT and EN.

---

## Locked decisions (confirmed with user)

1. **Architecture**: single-page. Chapters 01–05 are placeholder beats within the same `/[locale]/page.tsx`, **not** separate routes. Chapter-nav clicks jump using the same 800ms transition.
2. **3D phase 1**: R3F fullscreen canvas + **simple extruded bracket mesh** (no custom shader), breathing loop (scale 1.000 ↔ 1.008, 6s), ultramarine rim light. Particle field and shader-accurate material are deferred to phase 2 (HERO §4.5).
3. **Full beat system now**: wheel/touch/keyboard with 600ms debounce; shortcuts `Space/↓/PgDn` = advance, `↑/PgUp` = reverse, `0–5` = jump; `prefers-reduced-motion` degrades to cross-fade (HERO §5.6).
4. **Motion libs**: **framer-motion** (DOM entry stagger + micro-interactions) + **GSAP + @gsap/react** (beat-morph timeline orchestrating DOM exit + camera arc + chapter-nav underline + figure label — HERO §4.4).
5. **Package manager**: `yarn`.

---

## Component architecture

Everything under `void-page/components/`. Route files stay in `app/[locale]/`.

```
components/
  primitives/
    Bracket.tsx              server    — bracket SVG (sizes: micro|small|nav|hero) — DS §2.2
    CornerBracket.tsx        server    — corner glyph for PageFrame — DS §4.4
  chrome/
    PageFrame.tsx            server    — 4 corner brackets, 24px inset
    RunningHead.tsx          client    — 3-col: brand / motto / figure label (reactive to beat)
    ChapterNav.tsx           client    — 00–05 + active underline + PT·EN; calls jumpTo()
    LocaleSwitcher.tsx       client    — uses @/i18n/navigation Link
    ScrollPrompt.tsx         client    — breathing "Scroll · Genesis"; hides after first input
  hero/
    HeroStack.tsx            client    — bottom-left foldout: ChapterMark, H1, Sub, Detail, CTAs — HERO §2.4
    ChapterMark.tsx          server    — `[bracket] § NNN LABEL ───` (variant: hero | placeholder-centered)
    Button.tsx               server    — primary (ultramarine fill) + secondary (stroke), clip-path chamfer — DS §4.1
  beat/
    BeatContext.tsx          client    — { current, previous, direction, isTransitioning, jumpTo, advance, reverse }
    useBeatState.ts          client    — hook re-export
    BeatController.tsx       client    — wheel/touch/keyboard listeners + 600ms debounce + GSAP timeline
    BeatStage.tsx            client    — absolute-positioned layers: beat 0 = HeroStack, beats 1–5 = PlaceholderBeat
    PlaceholderBeat.tsx      server    — centered chapter-mark (§ NNN + LABEL)
  three/
    Scene.tsx                client    — <Canvas> fixed inset-0 z-0 + lights + CameraRig + BracketMesh
    BracketMesh.tsx          client    — ExtrudeGeometry from bracket SVG + breathing useFrame
    CameraRig.tsx            client    — useFrame reads beat progress (shared ref with GSAP)
types/
  beat.ts                              — BeatId = 0..5; Direction
```

Route:

```
app/[locale]/
  layout.tsx                 (edit)    — Inter weight:[300,400,500,900]
  page.tsx                   (edit)    — composes PageFrame + RunningHead + ChapterNav + HeroClient
  HeroClient.tsx             (new)     — client boundary; dynamic(Scene, {ssr:false}) + BeatContext.Provider
```

**Why `HeroClient.tsx`**: Next 16 only allows `dynamic({ ssr: false })` inside a client component. We isolate the boundary there; `page.tsx` stays server-rendered and SSR emits DOM for all beats (SEO + fallback for HERO §5.7).

---

## BeatController contract

```ts
interface BeatState {
  current: BeatId;         // 0..5
  previous: BeatId;
  direction: 'forward' | 'backward' | 'none';
  isTransitioning: boolean;
  jumpTo: (b: BeatId) => void;
  advance: () => void;     // clamped at 5
  reverse: () => void;     // clamped at 0
}
```

**"Scroll → beat advance" flow:**

1. `wheel` fires → `preventDefault()` (passive:false).
2. Gate: `isTransitioning || now - lastFireTs < 600ms` → discard.
3. Update `{current: next, previous: current, direction, isTransitioning: true}`.
4. `ScrollPrompt` flips `hasInteracted=true` → 160ms fade out.
5. `useGSAP` effect fires (HERO §4.4):
   - 0–280ms: current beat DOM exit (y/opacity).
   - 280–560ms: camera arc (GSAP writes to ref → R3F `useFrame` reads it).
   - 400–800ms: new beat stagger-in; ChapterNav underline slides (260ms); RunningHead.figureLabel swaps via AnimatePresence.
6. `onComplete` → `isTransitioning=false`. ScrollPrompt reappears if `current !== 5`.

**GSAP ⇄ framer-motion coexistence**: framer owns **only** the initial load-in and hover/focus. GSAP owns **every** inter-beat transition. `AnimatePresence mode="wait"` on beat layers prevents style conflicts.

---

## File list, in order

Dependencies first.

1. `package.json` — `yarn add framer-motion gsap @gsap/react`.
2. `app/globals.css` — add `html,body{overflow:hidden;height:100svh}` + `*{overscroll-behavior:none}`.
3. `app/[locale]/layout.tsx` — `Inter({ weight:["300","400","500","900"], ... })`.
4. `types/beat.ts` — shared types.
5. `components/primitives/Bracket.tsx` — port the SVG from `void-genesis-web/src/components/sections/hero.tsx:9-20`.
6. `components/primitives/CornerBracket.tsx` — DS §4.4 glyph.
7. `components/chrome/PageFrame.tsx`.
8. `components/chrome/RunningHead.tsx`.
9. `components/chrome/LocaleSwitcher.tsx`.
10. `components/chrome/ChapterNav.tsx` (stub `jumpTo` callback until M2).
11. `components/chrome/ScrollPrompt.tsx`.
12. `components/hero/Button.tsx`.
13. `components/hero/ChapterMark.tsx`.
14. `components/hero/HeroStack.tsx` — framer-motion with timings from `void-genesis-web/hero.tsx`.
15. `components/beat/BeatContext.tsx`.
16. `components/beat/useBeatState.ts`.
17. `components/beat/BeatController.tsx`.
18. `components/beat/PlaceholderBeat.tsx`.
19. `components/beat/BeatStage.tsx`.
20. `components/three/BracketMesh.tsx`.
21. `components/three/CameraRig.tsx`.
22. `components/three/Scene.tsx`.
23. `app/[locale]/HeroClient.tsx`.
24. `app/[locale]/page.tsx` — remove demo tokens, compose everything.

---

## Milestones (browser-verifiable)

**M1 — Static hero in PT/EN, no 3D, no beats.**
Files 1–3, 5–14, 24. `yarn dev` → `/en` and `/pt` render the full hero: chrome corners, running head (brand/motto/figure), chapter-nav row with switcher, chapter-mark, Inter-900 H1, split paper-dim/paper sub, detail, chamfered CTAs, breathing scroll prompt. Copy matches HERO.md verbatim. **Screenshot diff against `references/lusion-01-hero.jpeg`** to validate composition.

**M2 — DOM-only beat system (no 3D).**
Files 4, 15–19, 23, 24. Six DOM layers (beat 0 = HeroStack; beats 1–5 = centered PlaceholderBeat with `§ 00N LABEL`). Wheel + keyboard (`0–5`, `Space`, `↑↓`, `PgUp/PgDn`) navigate with 600ms debounce. GSAP timeline drives DOM exit/enter. ChapterNav underline slides; figureLabel swaps (`Fig. 001` → `Fig. 00N`).

**M3 — 3D mount.**
Files 20–22, 23 (update). R3F canvas fixed fullscreen behind DOM. Extruded bracket breathes; ultramarine rim on the top-right chamfer. Reduced-motion disables breath.

**M4 — Camera arc on beat advance.**
File 21 (update). Camera interpolates along an arc driven by the GSAP progress (shared ref). Scroll 0→5 and back; verify smoothness.

Restart `yarn dev` at the end of each milestone (locked user preference).

---

## Critical implementation files

- `void-page/app/[locale]/page.tsx` — top-level server orchestration.
- `void-page/app/[locale]/layout.tsx` — Inter with required weights.
- `void-page/app/[locale]/HeroClient.tsx` — client boundary; provider + scene + controller.
- `void-page/components/beat/BeatController.tsx` — core Lusion mechanic.
- `void-page/components/three/Scene.tsx` — R3F canvas + lights.
- `void-page/components/hero/HeroStack.tsx` — beat-0 DOM.
- **Reuse**: bracket SVG path from `void-genesis-web/src/components/sections/hero.tsx:9-20`; entry timings from the same file around lines 120–284.

---

## Open risks

1. **Next 16 `dynamic + ssr:false`** — must live inside a client component (handled via `HeroClient.tsx`).
2. **Inter weight:[300,400,500,900] on a variable font** — Next 16 subsets the emitted font; smoke-test required at 112px headline (including PT accented glyphs).
3. **Bracket SVG extrusion** — evenodd fill rule. Fallback: build `THREE.Shape` + holes procedurally.
4. **GSAP + React 19 Strict Mode** — ensure cleanup in `gsap.context()` inside the `useGSAP` return.
5. **URL sync for beat** — HERO.md doesn't specify. Phase 1: no sync. Revisit if share-link-to-beat becomes a requirement.
6. **Mobile Safari viewport** — handled via `100svh` + `overscroll-behavior:none`.

---

## End-to-end verification

From the `void-page/` directory:

```
yarn add framer-motion gsap @gsap/react
yarn dev
```

Then via **Playwright MCP** + the **`visual-convergence-loop` skill**:

1. `browser_navigate` → `http://localhost:3000/en`.
2. `browser_take_screenshot` of the initial viewport.
3. Visual diff against:
   - `void-genesis-web/references/lusion-01-hero.jpeg` — overall composition.
   - `void-genesis-web/references/lusion-hero-reload-T0.jpeg` — entry frame.
   - `void-genesis-web/references/lusion-02-afterwheel.jpeg` — beat-1 state after first input.
4. Interactions:
   - `browser_press_key ArrowDown` → centered beat 1 (`§ 001 SERVICES`).
   - `browser_press_key 3` → beat 3 (`§ 003 THE METHOD`).
   - `browser_press_key 0` → back to hero body.
   - `browser_evaluate` dispatching two `WheelEvent({deltaY:120})` within 100ms → confirm only one beat advances (debounce).
5. Locale switch: click PT·EN → URL flips to `/pt`, copy updates (`SERVIÇOS`, `O Objeto`).
6. Reduced motion: force via `browser_evaluate` + media emulation → confirm beat transition = cross-fade only.
7. Master Rule (HERO §6): screenshot for emotional validation by the user (security / seriousness / technology / discovery) before closing phase 1.

If the Master Rule does not land, **do not touch DOM or typography** — iterate only on 3D parameters (§4.5).
