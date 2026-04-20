# Void — Hero · Phase 3 · "A Silent Encounter"

> Companion to `HERO.md` and `HERO_PHASE_2.md`. Phase 3 supersedes Phase 2's beat-by-beat narrative (§7) and file map (§9). Material specs, lighting, starfield params, and post-processing pipeline from Phase 2 remain valid. Typography, copy, grid, and chrome composition remain locked from Phase 1.
>
> Status: spec locked via BDE discovery. Implementation not started.

## Context

The committed Phase 2 implementation delivers a working eclipse, but the beat-specific geometry (debris ring, method rings, nebula dust, demo vessels) violates the project's own "Silent Cinema" lock — four disposable palco modules on top of the only two primitives that actually carry meaning. The user's emotional reaction to beat 0 was unambiguous ("that's the eclipse"); the later beats were diluting, not amplifying.

This plan pivots the 3D narrative from **six different scenes** to **one continuous event**: **Void** (dark sphere, foreground) and **Genesis** (ultramarine sun, background) progressively aligning beat-by-beat. Beat 0 opens with Genesis only *pressentido* — a faint halo hinting at a presence that hasn't yet shown itself. Across beats 1–4 Genesis drifts along an orbital arc from behind-left toward dead-center. Beat 5 delivers the full eclipse, then Genesis continues its transit and exits — closing with a poetic flare rather than a frozen pose.

Outcome: a hero that reads as a single cinematic moment told through light and position, not a gallery of 3D tricks. Fewer files. Less code. More discipline.

BDE status: thesis locked via 3 user decisions (abertura = presença pressentida, trajetória = órbita lateral convergente, climax = Genesis passa atrás e continua). Emotional validation to be captured again after implementation (Master Rule criterion #4 + #5).

---

## Critical files — surface of the change

### Delete
- `void-page/components/three/OrbitalDebris.tsx`
- `void-page/components/three/MethodRings.tsx`
- `void-page/components/three/NebulaDust.tsx`
- `void-page/components/three/DemoVessels.tsx`
- `void-page/components/three/CoronaShader.tsx` (fallback no longer needed — back-sun resolves corona)

### Refactor / rewrite
- `void-page/components/three/Sphere.tsx` — split into two cleaner siblings:
  - `VoidSphere.tsx` — static at `(0.6, 0.4, 0)`, material unchanged from current (MeshPhysicalMaterial, #040416, breathing, idle rotation).
  - `GenesisSun.tsx` — beat-driven position + emissive intensity + scale. Reads current beat from `useBeatState`, interpolates between per-beat keyframes using the existing `cameraProgressRef` for transition progress. Exits in beat 5 after crossing behind Void.
- `void-page/components/three/Scene.tsx` — remove every `<BeatGate>` block for beat-specific layers, remove lazy `NebulaDust` import, reduce to: SpaceBackground + Starfield + VoidSphere + GenesisSun + CameraRig + PostProcess.
- `void-page/components/three/CameraRig.tsx` — rewrite `CAMERA_BEATS` around a *whispering* camera (6 gentle positions, ~4–6 unit distance). Drop the beat-5 FOV tween (no fly-in).
- `void-page/components/three/PostProcess.tsx` — `DOF_BEATS` becomes `Set([2])` only (intimacy on beat 2; the transit beat 5 reads crisper without DoF).
- `void-page/components/chrome/RunningHead.tsx` — no code change; only the string values behind `figureLabels.beat1..5` change.

### Update
- `void-page/locales/en.json` & `locales/pt.json` — rewrite `figureLabels.beat1..5` to fit the encounter narrative (proposals below, pending your editorial pass).
- `void-page/docs/HERO_PHASE_2.md` — append a §15 *"Phase 2.5 · Silent Encounter"* section that supersedes §7 (beat-by-beat narrative) and §9 (file map). The rest of the doc (material specs, starfield params, lighting, post-processing pipeline) remains valid.

### Keep unchanged
- `Starfield.tsx`, `SpaceBackground.tsx`, `BeatGate.tsx` (might still gate future subtle variations), `BracketMesh.tsx` (already deleted), `useBeatState.ts`, `BeatContext.tsx`, all chrome/hero/beat components outside RunningHead.

---

## Beat-by-beat choreography

Void stays at world `(0.6, 0.4, 0)`. Everything else moves.

| Beat | Genesis position (x, y, z) | Genesis scale · intensity | Camera (pos, lookAt) | DoF | Figure label (EN / PT · proposta) |
|---|---|---|---|---|---|
| 0 | (−1.8, 0.55, −1.6) | 0.75× · 0.35 | (0, 0, 5.8) · (0.6, 0.4, 0) | off | Fig. 001 · The Object / O Objeto |
| 1 | (−0.9, 0.5, −1.3) | 0.85× · 0.55 | (−0.2, 0.0, 5.6) · (0.6, 0.4, 0) | off | Fig. 002 · The Drift / A Deriva |
| 2 | (−0.05, 0.45, −1.05) | 0.95× · 0.75 | (0.1, 0.2, 4.4) · (0.6, 0.4, 0) | **on** | Fig. 003 · The Crescent / O Crescente |
| 3 | (0.30, 0.42, −0.90) | 1.02× · 0.90 | (0.4, 0.7, 5.6) · (0.6, 0.4, 0) | off | Fig. 004 · The Approach / A Aproximação |
| 4 | (0.52, 0.41, −0.82) | 1.08× · 1.05 | (0.55, 0.45, 4.8) · (0.6, 0.4, 0) | off | Fig. 005 · The Threshold / O Limiar |
| 5 start | (0.60, 0.40, −0.80) | 1.15× · 1.25 | (0.6, 0.4, 3.6) · (0.6, 0.4, 0) | off | Fig. 006 · The Transit / O Trânsito |
| 5 exit¹ | (1.9, 0.38, −1.05) | 1.00× · 0.70 | — | — | — |

¹ Beat 5 has two phases inside the same beat window: alignment → transit. See choreography note below.

**Scale values** multiply the base Genesis radius of `1.42`.
**Intensity** multiplies the emissive color `#3D3DE0` (implemented as per-frame `material.color.setScalar(factor)` or a uniform on a simple ShaderMaterial — whichever is simpler to animate).

### Beat 5 two-phase choreography

The single 800 ms beat window splits 50/50:
- **0 → 400 ms:** Genesis reaches dead-axis alignment at `(0.6, 0.4, −0.8)`, scale `1.15×`, intensity `1.25×`. Annular corona complete. This is the climax frame.
- **400 → 800 ms:** Genesis begins transit, drifting right and slightly back toward `(1.9, 0.38, −1.05)`, scale eases to `1.00×`, intensity decays to `0.70×`. Corona flares asymmetrically as the sun crosses out of axis.

Implementation: inside `GenesisSun.tsx`, when `current === 5 && isTransitioning`, drive a local progress value from `cameraProgressRef` split at `t=0.5`. When `current === 5 && !isTransitioning`, continue the transit drift slowly (e.g., at 0.05 rad/s orbital) so the hero never freezes.

### Reduced-motion fallback

- Genesis snaps to beat-5 alignment on mount and holds. No orbit, no transit, no breathing.
- Void static scale.
- Camera snaps to current beat position without easing (existing behavior in `CameraRig.tsx` reduced-motion branch is reused).

---

## Interpolation strategy — how to move Genesis smoothly

Reuse the existing `cameraProgressRef` that `BeatController.tsx` already drives on beat transitions (same 800 ms `expo.out` GSAP tween from 0 → 1). No new timing machinery needed.

Inside `GenesisSun.tsx`:

```
const t = THREE.MathUtils.clamp(cameraProgressRef.current.value, 0, 1)
const kFrom = KEYFRAMES[previous]
const kTo   = KEYFRAMES[current]
position.lerpVectors(kFrom.pos, kTo.pos, t)
scale = THREE.MathUtils.lerp(kFrom.scale, kTo.scale, t)
intensity = THREE.MathUtils.lerp(kFrom.intensity, kTo.intensity, t)
// apply: mesh.position.copy(position); mesh.scale.setScalar(scale); mat.color.setScalar(BASE_COLOR.r * intensity, ...)
```

Beat 5's mid-beat transit is a local override that kicks in once `t > 0.5`.

---

## Figure labels — proposals (editorial review required)

Pending sign-off. The old labels (The Spread, The Motion, The System, The Vessels, The Return) described the *beat-specific geometry* that no longer exists; they must change.

| Beat | EN | PT |
|---|---|---|
| 0 | The Object | O Objeto |
| 1 | The Drift | A Deriva |
| 2 | The Crescent | O Crescente |
| 3 | The Approach | A Aproximação |
| 4 | The Threshold | O Limiar |
| 5 | The Transit | O Trânsito |

These narrate the encounter linearly. Coherent with "Silent Cinema" — one event, no noise.

---

## Verification

End-to-end, in this order:

1. **Type + build** — `yarn tsc --noEmit` must pass. `yarn build` (optional) verifies production path.
2. **Dev server restart** — per user preference, restart `yarn dev` so changes land in browser. Probe `http://localhost:3000/en`.
3. **Visual walk via Playwright MCP** — screenshot each beat (`0` → `5`) at 1440×900. Compare against `void-genesis-web/references/lusion-*.jpeg` for composition — the expected parallel is Lusion's *final* reveal frame matching our *beat 5*, and our *beat 0* starting emptier than Lusion's opening.
4. **Visual convergence loop** — delegate the screenshot-diff-patch cycle to the `visual-convergence-loop` skill, which will pull in `frontend-design`, `baseline-ui`, `fixing-motion-performance`, and the 3D skills as needed until screens match intent.
5. **Master Rule pass (mandatory, per BDE)** — show user the beat-0 → beat-5 sequence without narration. Capture their reaction **in 2–3 physical-metaphor words**. Acceptance criteria:
   - Beat 0 reads as "emptiness" / "about to happen" / "dormant" — NOT "dark ball" or "incomplete".
   - Beat 5 climax reads as "eclipse" / "alignment" / "revelation" — NOT "bright ball".
   - Beat 5 transit reads as "passage" / "continues" / "transit" — NOT "fade out" or "disappears".
   If any criterion fails, iterate Genesis keyframes + bloom `luminanceThreshold` before touching anything else. Copy, typography, foldout, and chrome remain locked.
6. **Performance pass** — Chrome DevTools Performance tab, 8 s at beat 0 and 8 s at beat 5, both ≥ 58 fps average on M1 / Iris Xe. Draw calls should *drop* from the current implementation (fewer modules); target ≤ 20 at any beat.
7. **Reduced-motion pass** — DevTools → emulate `prefers-reduced-motion: reduce` → Genesis must render at beat-5 alignment and hold, no orbit, no breathing.
8. **Locale pass** — `/en` and `/pt` both render new figure labels correctly.
9. **Editorial review gate** — once the user signs off emotionally, confirm the proposed figure labels (EN + PT) are acceptable or revise them before we consider the refinement complete. Labels only get locked at that moment.

---

## Skills to invoke during execution

- **`visual-convergence-loop`** — orchestrates the implement → screenshot → diff → patch cycle. Entry point once code changes compile.
- **`fixing-motion-performance`** — if FPS drops after keyframe interpolation is wired up (unlikely, since we're removing modules).
- **`bde-method` (meta)** — master rule check with user at verification step 5. The refinement is not complete until emotional validation lands.

---

## What we are explicitly NOT doing

- No new Three.js geometry beyond the two existing spheres.
- No new dependencies.
- No changes to copy, typography, foldout, chrome structure, scroll mechanic, or navigation chapters.
- No fly-in through the sphere at beat 5 (the original spec's outro). The transit replaces it — a gentler, more editorial closure.
- No CoronaShader billboard fallback. Back-sun geometry + bloom is proven to work.

---

## Rollback

Current working state is committed. If any refinement makes the hero worse than the committed baseline, `git reset --hard HEAD` restores the working Phase 2 eclipse.
