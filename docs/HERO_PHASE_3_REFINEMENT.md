# Hero Phase 3 · Refinement — "Silent Encounter, Open Invitation"

> Companion to `HERO_PHASE_3.md`. Documents the post-walkthrough refinement that (a) flips Genesis's trajectory direction, (b) relocates the eclipse climax from beat 5 to beat 4, and (c) converts beat 5 into a deep-space editorial invitation with contact form. Supersedes §Beat keyframes and §Camera beats of `HERO_PHASE_3.md`; the rest of Phase 3 (delete list, split pattern, DOF policy, reduced-motion contract) still holds.
>
> Status: spec locked via BDE iteration with user after Playwright walkthrough (2026-04-20). Implementation not started.

## Context

Phase 3 core implementation landed (5 obsolete modules deleted, `VoidSphere.tsx` + `GenesisSun.tsx` split, camera rig rewritten, PostProcess `DOF_BEATS = Set([2])`, locales updated, typecheck passing, dev server rebooted, Playwright walk recorded).

The walkthrough with the user surfaced three directional corrections that need a second pass before the phase can be considered shipped:

1. **Trajectory direction is reversed.** Current Genesis keyframes enter from upper-LEFT and exit right. The intended encounter comes from upper-RIGHT and passes through Void earlier in the narrative — so the eclipse climax is experienced during DEMOS (beat 4), not at the end.
2. **Beat 5 must open up.** Instead of staying on the climax, beat 5 (CONTACT) should feel like the aftermath: Genesis has left the scene, the camera dollies far back into deep space, the starfield intensifies (no longer outshone by Genesis's bloom), and a contact form renders as an editorial invitation ("let's build something together"). Void stays in the world but becomes a tiny distant speck via camera pullback (user answered this explicitly).
3. **Void reads too heavy.** Current radius 1.25 with `metalness 0.6 / clearcoat 0.55` produces a dense, glossy pearl that dominates the frame. The user wants a lighter, smudgier "distortion in space" — smaller, matter, less metallic.

Lusion's *client-zero* was re-inspected live via Playwright: their sphere sits at ~12% of viewport width with strong backlit corona and matte-navy body, composition the user already green-lit as primary DNA.

Outcome targeted: narrative pivots by one beat (climax at DEMOS), beat 5 opens into a deep-space editorial form, and Void's presence settles into "silent distortion" sizing.

---

## Files to change

### Rewrite

- **`components/three/GenesisSun.tsx`** — flip KEYFRAMES X-axis (upper-right entry); move the full-alignment climax to beat 4 (was beat 5); at beat 5 ramp `intensity → 0` and push `pos` far off-screen so Genesis fully exits. Retire the beat-5 two-phase split (no longer needed — beat 5 has no Genesis presence). Keep `POST_TRANSIT_DRIFT_RATE` but apply it to beat-4 post-transition drift instead (tiny ongoing motion so the climax never freezes).
- **`components/three/VoidSphere.tsx`** — geometry radius `1.25 → 0.85`; material `metalness 0.6→0.2`, `roughness 0.34→0.7`, `clearcoat 0.55→0.15`, `envMapIntensity 0.8→0.35`; add `transparent: true, opacity: 0.92` to soften the silhouette; add a second sibling mesh (outer haze) at radius 1.15 with a radial-falloff `ShaderMaterial` (additive, `depthWrite: false`, opacity 0.18) to suggest gravitational-lens "distortion" without new deps.
- **`components/three/CameraRig.tsx`** — new CAMERA_BEATS: climax at beat 4 (`z ≈ 3.6`), beat 5 pulls far back (`z ≈ 14, pos (0.9, 0.6, 14), lookAt (0.8, 0.5, 0)`) for deep-space reveal; beats 0–3 mirrored to stage Genesis's upper-right entry. FOV remains constant at 34.
- **`components/three/Starfield.tsx`** — introduce `uBeatBoost` uniform (lerped 0→1 when `current === 5` over the 800 ms transition, using `cameraProgressRef`). In each layer's fragment shader multiply alpha and point-size by `(1 + uBeatBoost * k)` so stars visibly densify when Genesis has left.
- **`components/three/PostProcess.tsx`** — beat-5-aware tuning: `Bloom.intensity 1.6 → 1.2` and `Vignette.darkness 0.62 → 0.48` at beat 5 so the form reads crisp and periphery doesn't crush stars. Keep `DOF_BEATS = Set([2])`.

### Update

- **`components/beat/BeatStage.tsx`** — mount new `<ContactForm />` when `current === 5` (replacing `<PlaceholderBeat />` for that beat only; beats 1–4 keep `PlaceholderBeat`).
- **`locales/en.json` / `locales/pt.json`** — rewrite `figureLabels.beat4 → "Fig. 005 · The Eclipse" / "O Eclipse"`, `figureLabels.beat5 → "Fig. 006 · The Invitation" / "O Convite"`. Add new keys: `contact.headline`, `contact.name`, `contact.email`, `contact.message`, `contact.cta`, `contact.mailSubject`. Labels flagged "editorial review required" following the Phase 3 practice.

### Create

- **`components/contact/ContactForm.tsx`** — new client component. Fields: Name (text), Email (email), Message (textarea, rows 4). Submit CTA styled after `components/hero/Button.tsx` primary (ultramarine clipped polygon, 11px mono uppercase). Layout: fixed overlay centered in viewport with `pointer-events-auto`, width ~520px, stacked label-above-field with bottom-border-only inputs (mono 11px uppercase labels, paper-colored 14px values). Uses existing i18n hook for copy. Submit handler: v1 opens `mailto:higorscreamo@gmail.com?subject=...&body=...` with pre-filled fields; future upgrade path = fetch POST to a backend.

### Keep unchanged

`Scene.tsx`, `SpaceBackground.tsx`, `BeatGate.tsx`, `useBeatState.ts`, `BeatContext.tsx`. `BeatController.tsx` already skips keystroke beat navigation when focus is on `<INPUT>`/`<TEXTAREA>` (`components/beat/BeatController.tsx:36-41`) — form inputs work natively, no change needed.

---

## Numeric targets

### Genesis keyframes (X flipped, climax moved to beat 4, beat 5 exits)
| Beat | pos (x, y, z) | scale | intensity | note |
|------|---|---|---|---|
| 0 | (2.5, 0.85, −1.8) | 0.75 | 0.35 | hint upper-right |
| 1 | (1.85, 0.70, −1.55) | 0.85 | 0.55 | drift |
| 2 | (1.20, 0.55, −1.25) | 0.95 | 0.75 | crescent |
| 3 | (0.85, 0.45, −1.00) | 1.02 | 0.90 | approach |
| 4 | (0.60, 0.40, −0.80) | 1.15 | 1.25 | **eclipse climax** |
| 5 | (3.8, 0.35, −2.20) | 0.85 | 0.00 | exited — fully gone |

### Camera beats (all `lookAt (0.6, 0.4, 0)` except beat 5)
| Beat | pos |
|------|---|
| 0 | (0.10, 0.10, 5.8) |
| 1 | (0.20, 0.15, 5.4) |
| 2 | (0.30, 0.25, 4.6) |
| 3 | (0.45, 0.35, 4.2) |
| 4 | (0.60, 0.40, 3.6) |
| 5 | (0.90, 0.60, 14.0) · lookAt (0.8, 0.5, 0) |

### Void material
- radius 1.25 → 0.85
- metalness 0.6 → 0.2, roughness 0.34 → 0.7, clearcoat 0.55 → 0.15, envMapIntensity 0.8 → 0.35
- `transparent: true, opacity: 0.92`
- new sibling haze mesh: radius 1.15, additive, radial gradient, opacity 0.18

### Starfield boost (beat 5 only)
- new uniform `uBeatBoost` lerped from 0 → 1 over 800 ms when transitioning to beat 5 (reads `cameraProgressRef.current.value` and `current === 5`)
- fragment: `alpha *= (1 + uBeatBoost * 0.8)`, `sizeAdd += uBeatBoost * 0.5`

### PostProcess beat 5
- Bloom intensity 1.6 → 1.2 (lerped with transition progress)
- Vignette darkness 0.62 → 0.48

---

## Beat narrative (post-refinement)

| Beat | Reading |
|------|---|
| 0 | Void alone (smaller, smudgier). Genesis as faint glow pressentido upper-right. **The Object** |
| 1 | Genesis drifts in from the right. **The Drift** |
| 2 | Crescent on Void's right edge. DoF on. **The Crescent** |
| 3 | Genesis approaches, mostly behind Void. **The Approach** |
| 4 | Full annular eclipse. Climax. **The Eclipse** |
| 5 | Camera pulls far back → deep space. Genesis gone. Void a distant speck. Starfield dense. Contact form rendered as editorial invitation. **The Invitation** |

---

## Contact form sketch

```
         LET'S BUILD TOGETHER.
         § 006 · THE INVITATION

         NAME
         ─────────────────────────
         EMAIL
         ─────────────────────────
         MESSAGE
         ─────────────────────────
         ─────────────────────────
         ─────────────────────────

         [ START THE CONVERSATION → ]
```

Styling tokens: ultramarine accent, paper on void, mono 11 px uppercase for labels, paper 14 px regular for values, bottom-border-only inputs, focus → 1 px ultramarine outline (already wired in `app/globals.css:38-44`).

---

## Verification

1. `yarn tsc --noEmit` passes.
2. Kill port 3000, restart `yarn dev`, `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en` returns 200.
3. Playwright walk at 1440×900: screenshot each beat 0 → 5, confirm (a) Genesis enters from upper-right across 0–3, (b) annular eclipse present at beat 4, (c) at beat 5 the frame is deep-space with dense stars + rendered contact form, no visible Genesis bloom, Void a small distant distortion.
4. Focus/keyboard sanity: tab into form inputs, type — beat should not advance. Submit → mailto opens with pre-filled subject/body.
5. `prefers-reduced-motion`: Genesis snaps to beat-4 alignment, no drift; camera snaps per beat; contact form still renders normally at beat 5.
6. PT locale: `/pt` renders new `figureLabels.beat4/5` + translated form copy.
7. Draw-call budget: ≤ 22 at any beat (adds haze mesh + form DOM nodes; geometry budget remains low).
8. BDE Master Rule pass — user reacts to beats 0→5 in 2–3 physical-metaphor words. Acceptance: beat 4 reads "eclipse / alignment / revelation"; beat 5 reads "expanse / invitation / open / deep space".

---

## Open editorial items (post-merge)

- Figure labels "The Eclipse / The Invitation" + PT mirrors flagged for editorial review, same practice as Phase 3 spec.
- `mailto:` v1 submit handler to be upgraded to a real backend (Resend / formspree / custom API) in a follow-up PR.
- `HERO_PHASE_2.md` §15 pointer to `HERO_PHASE_3.md` (already pending from Phase 3 core) will also append a sub-note referencing this refinement.
