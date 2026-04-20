# Void — Hero · Phase 2

> Companion to `HERO.md` and `DESIGN_SYSTEM.md`. Scope: the second iteration of the hero's 3D/motion layer, pivoting the primary object from an extruded bracket mesh to a single eclipsed sphere in silent orbit. Everything here inherits from the brand-level spec; where this doc and `HERO.md` conflict, **this doc wins for 3D-layer decisions only**. Typography, copy, grid, and chrome composition remain locked.
>
> Status: directional v1. Implementation follows in a separate execution plan.
>
> **Copy lock still holds.** No new headline, sub, detail, or CTA copy. New figure labels (§7) are proposed as placeholders pending editorial review.

---

## 0 · Thesis

Phase 1 landed the editorial grammar and the scroll mechanic. Phase 2 makes the space real. The Object is a void-sphere in silent orbit, eclipsed from behind by an ultramarine sun. Stars at three parallax depths hold the silence. The bracket retires from 3D — it speaks only through the chrome (running head, chapter marks, corner glyphs), where a mark belongs.

---

## 1 · External references

### 1.1 Lusion — Client Zero (primary DNA, Phase 2)

URL: `https://client-zero-tech.lusion.co/`
Role: **primary DNA** for sphere framing, backlit corona, deep-space gradient, and the post-processing stack that produces the "inside a capsule" feel.

**Observed (live inspection):**

- Central sphere at ~20% of the viewport, near-black navy body (`#0B0D2E`), fixed position, barely breathing.
- Annular eclipse corona: `#FFFFFF` core → `#A8E0FF` → `#6CC7FF` → `#1E2A80`, roughly 80px falloff. Fed by a single strong off-camera key light behind the sphere.
- Hero background is *not* a starfield — it's a vertical "fur" of silver-blue needles with floating metallic debris. Genuine starfields appear from beat 2 onward.
- Background gradient: `#000000 → #0E1028 → #1A1C38`. Never flat black.
- Heavy bloom, chromatic aberration (visible cyan/magenta fringe on the corona), vignette ~15–20%, fine film grain. Light depth-of-field.
- Scroll is wheel-hijacked; camera dollies along a fixed narrative path, objects morph/cross-fade between beats. Inside-sphere fly-through as the outro.
- First-three-seconds impression: **witnessing an eclipse from the dark side of orbit** — reverence, not motion.

**What we take:** centered sphere framing; backlit-corona as the hook; deep-space gradient that is never pure black; three-depth starfield on later beats; full post-processing stack (bloom + aberration + vignette + grain); fixed-path camera dolly; inside-sphere fly-in as the final beat.

**What we leave:**
- Their accent `#0DF6FF` (cyan) → Void uses `#2B2BC2` ultramarine.
- Their navy body `#0B0D2E` → Void uses `#040416` (a blue-tinged void, barely readable as color).
- Their "fur field" of vertical needles → Void uses a genuine three-layer starfield (per the user's direction, and consistent with Silent Cinema restraint).
- Their 2023-cube / orbital-phone product morphs → Void's narrative lives in its own beats (§7).
- Their persistent `$ZERO` ticker → the figure label already occupies that editorial slot.

### 1.2 DESIGN_SYSTEM.md tokens (invariant)

`void #030308`, `paper #ECE4D4`, `paper-dim #8A8476`, `paper-ghost #4A463F`, `ultramarine #2B2BC2` — non-negotiable. The sphere, starfield, and corona all use only these colors and their desaturations.

### 1.3 Lusion screenshot set

`void-genesis-web/references/lusion-*.jpeg` — eight frames covering beats 01 → 06. Used for composition diffing during implementation.

---

## 2 · Supersedings (what this doc overrides in `HERO.md`)

This is the only place where Phase 2 deviates from the locked spec. Everything not listed here remains as `HERO.md` declares it.

| `HERO.md` reference | Original lock | Phase 2 override |
|---|---|---|
| §4.2 "The primitive" | Hero 3D object is the **bracket mesh itself** (extruded from DS §2.1). | Hero 3D object is a **sphere**. The bracket survives only in chrome — running head, chapter marks, corner glyphs, CTA arrows. |
| §4.5 bullet "Exact material / shader for the bracket" | Material is open for iteration on the bracket extrusion. | Reframed as "Sphere material + corona strategy" (see §4 below). |
| §2.5 "Right half of viewport" | Bracket occupies upper-two-thirds, right half; foldout bottom-left. | Sphere centralizes more (≈ horizontal center, slightly upper); foldout bottom-left still holds. The "right-half DOM-silent" rule loosens to "upper-two-thirds DOM-silent." |
| §4.4 beat-morph camera arc | Camera arcs around an off-center bracket. | Camera dollies along a fixed narrative path through a single sphere-centered scene (see §7). Transition easing and total duration (800 ms cubic-bezier `0.16, 1, 0.3, 1`) are preserved. |

Every other lock — copy, typography, foldout composition, chrome structure, scroll mechanic (one input = one beat, 600 ms debounce, `prefers-reduced-motion` fallback, no-WebGL fallback) — stands unchanged.

---

## 3 · The Object — redefined

### 3.1 Geometry

- `THREE.SphereGeometry(1.25, 96, 96)`.
- World position: `(0.6, 0.4, 0)` — slightly right of center and slightly above the horizon line, so the foldout (bottom-left of the viewport) reads on clean void while the sphere anchors the upper-two-thirds.
- Rotation: imperceptible drift on the `y` axis, `0.018 rad/s` idle, `0.05 rad/s` during beat transition (motion without showing off).

### 3.2 Material

`THREE.MeshPhysicalMaterial`:

| Prop | Value | Why |
|---|---|---|
| `color` | `#040416` | Near-void with a single drop of blue. Not pure black — pure black reads as sticker. |
| `metalness` | `0.60` | Catches the ultramarine rim light without going chrome. |
| `roughness` | `0.34` | Soft specular rolloff; avoids the "plastic sphere" tell. |
| `clearcoat` | `0.55` | A faint glassy layer so the rim has a secondary highlight. |
| `clearcoatRoughness` | `0.22` | Sharpens the rim line. |
| `envMapIntensity` | `0.8` | If we ever add an HDRI; zero-cost when there isn't one. |

No emissive. The glow must come from the bloom pass, not from the body.

### 3.3 Breathing

Scale `1.000 ↔ 1.006`, period 7.0 s, `ease-in-out` sine. Slower and smaller than Phase 1's bracket breathing (1.008 over 6 s). The sphere should read as *massive* — large things breathe slowly.

### 3.4 Corona strategy

First pass: no custom shader. The corona is produced entirely by the lighting + bloom combination:

1. A strong ultramarine `directionalLight` + `pointLight` pair *behind* the sphere (§5).
2. Bloom with `luminanceThreshold 0.22` lets the rim light bleed ~60–90px into the darkness.
3. Chromatic aberration fringes the bloom's edge with a subtle cyan/indigo split.

**Acceptance criterion**: if a first-time viewer describes the hero as "a dark ball," the corona is too weak. If they say "an eclipse" or "a planet in shadow," it is working. When lighting + bloom cannot hit this, fallback to §3.5.

### 3.5 Corona fallback — `CoronaShader.tsx` (conditional)

A billboard quad of size `3.2 × 3.2` positioned behind the sphere (negative `z`), always facing camera, using a radial-gradient `ShaderMaterial` with `AdditiveBlending`. Stops: ultramarine at `0.12` radial → transparent at `0.45`. Turned off by default; enabled only if the bloom-driven corona fails acceptance.

---

## 4 · Space environment

### 4.1 Background gradient

Replace the current flat `<color attach="background">` with a deep-space radial gradient rendered as either:

- **Option A (preferred)**: an inverted icosphere at radius 40 with a `ShaderMaterial` computing `mix(#030308, #0A0A18, fresnel)` in view-space. Self-contained, GPU-cheap.
- **Option B (fallback)**: a single plane behind the camera (`position.z = -30`) with the same shader.

Stops: `#030308` (edges) → `#080818` (mid) → `#0A0A18` (center-behind-sphere). The gradient must never be perceived as lit — it is space, not a backdrop.

### 4.2 Starfield — three parallax layers

| Layer | Count | Radius | Point size (px) | Opacity | Colors |
|---|---|---|---|---|---|
| A (distant) | 2200 | 45 | 0.4 – 1.2 | 0.55 | 88% paper, 8% paper-dim, 4% desaturated ultramarine |
| B (mid) | 600 | 20 | 0.8 – 2.2 | 0.82 | same palette |
| C (near debris) | 120 | 8 | 1.4 – 3.5 | 1.00 | 15% ultramarine, rest paper / paper-dim |

Each layer is a `<Points>` with a custom shader that does two things:

1. **Twinkle** — per-star random phase offset baked into an attribute buffer; opacity oscillates in `[0.70, 1.00]` at `0.25–0.60 Hz`, independent per star.
2. **Parallax** — during camera transitions, the rig offsets each layer's position by `(1 - depthWeight) · cameraDelta`, with weights A = 1.00, B = 0.60, C = 0.30. Far stars barely drift; near stars fly past.

**No starfield on `prefers-reduced-motion`** — twinkle and parallax both disabled; all three layers render as static points.

### 4.3 No nebula on the hero

Phase 2 beat 0 is **empty space**. Nebula dust belongs to beat 3 (§7), where the space "opens up." Putting dust on the hero weakens the eclipse — restraint.

---

## 5 · Lighting

| Light | Position | Intensity | Color | Role |
|---|---|---|---|---|
| `ambientLight` | — | `0.08` | `#8A8476` | Deep-space ambient. Near-zero. |
| `directionalLight` (key) | `(-4.5, 2.8, -3)` | `0.90` | `#2B2BC2` | The eclipsed sun. Hits sphere rim. |
| `directionalLight` (fill) | `(2, 3, 6)` | `0.25` | `#ECE4D4` | Paper-warm kiss — keeps foldout text-area from going completely dead. |
| `pointLight` (corona seed) | `(0.6, 0.4, -5)` | `3.5` | `#2B2BC2` | Directly behind sphere. Source of the bloom's corona. |

No hemisphere light. No area lights. No HDRI. No shadows. Shadows cost GPU and the sphere reads better without them against a deep-space bg.

---

## 6 · Post-processing stack

Dependency to add: `@react-three/postprocessing` (~45 kb gz). Pipeline (`EffectComposer`), in order:

1. **Bloom**
   - `intensity 1.6`
   - `luminanceThreshold 0.22`
   - `luminanceSmoothing 0.45`
   - `mipmapBlur true`
   - `radius 0.85`
   - Half-resolution buffer.
   - **This IS the corona.** Tune `luminanceThreshold` first when corona reads weak.

2. **ChromaticAberration**
   - `offset [0.0009, 0.0007]`
   - `radialModulation true`
   - `modulationOffset 0.42`
   - Adds cyan/magenta fringe at the corona edge.

3. **Vignette**
   - `offset 0.32`
   - `darkness 0.62`
   - `eskil false`
   - Darkens corners ~18%. Frames the composition like a porthole.

4. **Noise** (film grain)
   - `opacity 0.075`
   - `premultiply true`
   - Mobile drops to `0.04`.

5. **DepthOfField** (conditional per beat, see §7)
   - `focusDistance 0.02`
   - `focalLength 0.04`
   - `bokehScale 2.8`
   - On for close-proximity beats (2 and 5); off for panoramic beats (0, 3, 4).

**Bypass rules:**
- `prefers-reduced-motion`: the entire EffectComposer is skipped. Scene renders raw.
- No-WebGL (§5.7 of HERO.md): composer never mounts; DOM fallback unchanged.
- Mobile: DOF removed entirely; DPR clamped to `[1, 1.5]`; bloom at quarter-resolution buffer.

---

## 7 · Beat-by-beat spatial narrative

Each beat defines: *name · visual scene · camera position / look-at · DOF · figure label*.

### Beat 0 — OPENING
**Scene.** The Object revealed. Eclipse at rest. Three-layer starfield at idle — far, distant, silent. Corona visible but not aggressive.
**Camera.** Position `(0, 0, 5.8)`, look-at `(0.6, 0.4, 0)`.
**DOF.** Off.
**Figure label.** `Fig. 001 · The Object`.

### Beat 1 — SERVICES
**Scene.** Debris reveal. Around the sphere, ~18 small chamfered tile-meshes (each a DS §4.1 bracket-chamfered 2D plane, hatched with paper-dim lines, 0.22 opacity) drift in a shallow equatorial ring, slow rotation, never in front of the sphere. The debris carries the *service tiers* as visual weight — no copy on the tiles themselves.
**Camera.** Position `(-2.4, -0.2, 6.5)`, look-at `(0, 0, 0)`.
**DOF.** Off.
**Figure label.** `Fig. 002 · The Spread`.

### Beat 2 — HOW WE WORK
**Scene.** Inside the orbit. Camera dives between the outer debris ring and the sphere surface. Near starfield (layer C) becomes prominent — the viewer is in the crossflow. Close debris drifts across the lens.
**Camera.** Position `(1.3, 0.4, 2.6)`, look-at `(0, 0, 0)`.
**DOF.** **On** — shallow. Sphere surface sharp; foreground debris soft.
**Figure label.** `Fig. 003 · The Motion`.

### Beat 3 — THE METHOD
**Scene.** Aerial diagram. Camera pulls back and up. Three faint luminous rings appear at radii `2.0 / 3.2 / 4.8`, each a thin torus with `meshBasicMaterial` ultramarine, opacity `0.18`. Behind them, a nebula dust cloud fades in (instanced sprites, ~400 particles, ultramarine @ 0.22 opacity, very slow drift). This is the system seen from above — the method.
**Camera.** Position `(0, 3.8, 9.5)`, look-at `(0, 0, 0)`.
**DOF.** Off.
**Figure label.** `Fig. 004 · The System`.

### Beat 4 — DEMOS
**Scene.** Constellation. Four mini-spheres (`r = 0.35`) orbit the main sphere at different phase offsets on an equatorial ring of radius `3.0`. Each mini uses a distinct material signature, so the user reads "four different artifacts":
  1. matte paper (`#ECE4D4`, roughness 0.85, metalness 0.05)
  2. ultramarine clearcoat (`#2B2BC2`, clearcoat 0.9)
  3. dark glass (`transmission 0.9, ior 1.4, thickness 0.5`)
  4. wireframe (`meshBasicMaterial wireframe true, color paper-dim`)
Main sphere remains primary.
**Camera.** Position `(-3.2, 0.8, 5.4)`, look-at `(0, 0, 0)`.
**DOF.** Off.
**Figure label.** `Fig. 005 · The Vessels`.

### Beat 5 — CONTACT
**Scene.** Fly-in. Camera travels toward the sphere's center. A radial dissolve shader on the sphere surface opens into a full-viewport starfield (layer A becomes the entire frame). FOV tweens from `34` to `75` to sell the fisheye. Outro feel: the viewer has entered transmission range.
**Camera.** Position animates from previous beat to `(0, 0, 0.35)`, look-at `(0, 0, 0)`. FOV tween parallel to arc.
**DOF.** **On** — heavy during entry, resolving to crisp.
**Figure label.** `Fig. 006 · The Return`.

### Figure-label i18n

Phase 2 adds five figure labels. Additions to `locales/en.json` and `locales/pt.json`, under a new `figureLabels` key:

| Beat | EN | PT |
|---|---|---|
| 1 | `Fig. 002 · The Spread` | `Fig. 002 · O Alcance` |
| 2 | `Fig. 003 · The Motion` | `Fig. 003 · O Movimento` |
| 3 | `Fig. 004 · The System` | `Fig. 004 · O Sistema` |
| 4 | `Fig. 005 · The Vessels` | `Fig. 005 · Os Vasos` |
| 5 | `Fig. 006 · The Return` | `Fig. 006 · O Retorno` |

All proposed — editorial review required before lock.

---

## 8 · Camera rig

Update `components/three/CameraRig.tsx`:

- Replace `CAMERA_BEATS` with the six positions above.
- Preserve the existing `cameraProgressRef` interpolation and the `expo.out` GSAP easing over `520 ms` starting at `280 ms` into the 800 ms beat window.
- **New**: camera `fov` tween for beat 5, parallel to the position arc:
  ```
  gsap.to(camera, { fov: 75, duration: 0.52, ease: 'expo.out' });
  camera.updateProjectionMatrix();  // per-frame in useFrame while tweening
  ```
- FOV resets to `34` on reverse or on jump-to any other beat.
- `prefers-reduced-motion`: camera snaps to target position in one frame, no arc, no FOV tween, no easing.

---

## 9 · File map

### New
- `components/three/Sphere.tsx` — The Object. Replaces `BracketMesh.tsx`.
- `components/three/Starfield.tsx` — Three `<Points>` layers with twinkle + parallax shader.
- `components/three/SpaceBackground.tsx` — Radial-gradient shader icosphere or plane.
- `components/three/PostProcess.tsx` — EffectComposer with Bloom + ChromaticAberration + Vignette + Noise + conditional DOF.
- `components/three/OrbitalDebris.tsx` — Beat 1 tile-ring.
- `components/three/MethodRings.tsx` — Beat 3 three torus rings.
- `components/three/NebulaDust.tsx` — Beat 3 particle cloud (lazy-imported).
- `components/three/DemoVessels.tsx` — Beat 4 four mini-spheres with distinct materials.
- `components/three/CoronaShader.tsx` — Beat 0 corona fallback billboard (mounted only if acceptance test in §3.4 fails).

### Modified
- `components/three/Scene.tsx` — rewrite. Compose new lights + backgrounds + starfield + sphere + post-process + gated beat-specific layers via `<BeatGate beat={n}>`.
- `components/three/CameraRig.tsx` — new `CAMERA_BEATS` + FOV tween.
- `components/chrome/RunningHead.tsx` — update `FIGURE_TITLES` map to use the new label keys instead of deriving from nav items.
- `locales/en.json`, `locales/pt.json` — add `figureLabels.beat0N` entries.

### Deleted
- `components/three/BracketMesh.tsx` — after the sphere is live.

### Unchanged
Everything under `components/chrome/` (except `RunningHead` above), `components/hero/`, `components/beat/`, `components/primitives/`, `app/[locale]/*`.

---

## 10 · Dependencies

```
yarn add @react-three/postprocessing
```

No other additions. `maath`, `three-stdlib`, and friends are not required for Phase 2 — they become candidates only if we add procedural noise meshes in Phase 3.

---

## 11 · Performance budget

Non-negotiable acceptance criteria:

- **60 fps sustained** on a mid-range laptop (Apple M1, Intel Iris Xe at 1440 × 900). Minimum 58 fps average, 45 fps worst-frame.
- **Draw calls ≤ 40** in beat 0.
- **Triangle count ≤ 45 k** in beat 0 (sphere at 96×96 ≈ 18 k; rest is `<Points>` which doesn't count toward the tri budget). ≤ 90 k in beat 4 (main + four minis).
- **Bloom at half-resolution** by default; quarter-res on mobile.
- **DOF off on mobile.** DPR clamped to `[1, 1.5]`.
- **Reduced-motion path**: post-process bypassed, sphere static, starfield without twinkle or parallax, beat transitions cross-fade only (per HERO.md §5.6). Entry animation single 400 ms fade.
- **No-WebGL path** (HERO.md §5.7): DOM-only hero remains identical to Phase 1. Phase 2 changes do not affect it.

---

## 12 · Master Rule — Phase 2 criteria

The original three conditions from `HERO.md` §6 still hold. Phase 2 adds two:

4. **"Eclipse, not ball."** An unprompted first-time viewer describes the hero using "eclipse," "planet in shadow," "orbit," or "sun-behind" language. If they describe "a dark sphere" or "a ball with glow," the corona is under-tuned — iterate §3.4 / §6 Bloom before anything else.

5. **"Air, not stage."** Scrolling from beat 0 into beat 3 reads as *distance opening up* — the viewer senses air between the camera, the debris, the rings, and the background. If the composition reads flat or "like a layered image," starfield parallax weights (§4.2) are off, or the fog/gradient stops are wrong.

Both failures must be fixed inside the 3D layer. **Do not touch DOM composition, typography, or copy to chase Master Rule results.**

---

## 13 · Open items

- **Beat 5 overlay copy**: §7 Beat 5 mentions a possible "Transmission open" mono label. This is *new copy* and violates the Phase 1 copy lock. **Default**: do not ship the overlay. Recommend visual-only transition. Revisit after editorial review.
- **Figure labels 02–06**: first-pass proposals. Awaiting editorial sign-off before committing to locale files.
- **Nebula dust (beat 3)**: if perf budget tightens, fall back to a single 2D sprite with a radial-gradient texture.
- **Corona strategy**: `§3.4` (lighting + bloom only) vs `§3.5` (billboard shader). Start with §3.4; escalate only on failing Master Rule criterion #4.
- **Reduced-motion beat 3 / beat 4 treatment**: current rule collapses to cross-fade. Consider whether the debris / rings / vessels should mount at all under reduced motion, or be omitted entirely for calm.

---

## 14 · Verification

After implementation (in a subsequent PLAN):

1. `yarn dev` → `/en` and `/pt`. Walk all six beats via keyboard (`Space` → forward, `ArrowUp` → backward, `0–5` → jump).
2. Playwright MCP:
   - `browser_take_screenshot` at each beat.
   - Diff against `void-genesis-web/references/lusion-*.jpeg` for spatial composition.
   - Capture reload frame T0 to validate entry stagger (HERO.md §5.1 timings preserved).
3. Master Rule pass:
   - Show beat 0 → capture first impression from the user.
   - Walk beat 0 → beat 3 → capture sense of "distance opening."
   - Walk beat 0 → beat 5 → capture the fly-in as closure, not a jarring cut.
4. Performance pass:
   - Chrome DevTools → Performance tab → record 8 s of idle at beat 0 and 8 s of beat 4. Both must hit ≥ 58 fps average.
   - Memory: heap stable across 10 beat cycles; no listener / texture leaks.
5. Reduced-motion pass:
   - DevTools → rendering → emulate `prefers-reduced-motion: reduce` → post-process skipped, sphere static, transitions cross-fade.
6. No-WebGL pass:
   - DevTools → disable WebGL → DOM hero still serves the full editorial content per HERO.md §5.7.

If any Master Rule criterion fails, iterate only the parameters listed in §3, §4, §5, §6 of this document. Composition, typography, copy, and chrome are locked.

---

*End of Phase 2 spec. The bracket steps into the chrome. The sphere takes the stage.*
