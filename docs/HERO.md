# Void — Hero

> Companion to `DESIGN_SYSTEM.md`. Scope: hero section only. Everything here inherits from the brand-level spec. Where this doc and `DESIGN_SYSTEM.md` conflict, `DESIGN_SYSTEM.md` wins — this file only refines *hero-specific* application.
>
> Status: definitive v1. Master Rule validation (§6) is deferred to the rendered page of the next project, per the agreed scope.
>
> **Copy lock.** All copy strings in this document are inherited **verbatim** from the current `void-genesis-web` codebase (`src/components/sections/hero.tsx`, `src/components/nav.tsx`, `src/components/footer.tsx`). The next project preserves every string without changing a comma. Design is the only variable; words are not. If a slot has no existing copy source, the slot is either dropped or explicitly marked "awaiting copy." **Nothing in this document invents new copy.**

---

## 0 · Intention (one sentence)

In the first 5 seconds the hero must convey: **you are being briefed**, not sold to. The visitor lands inside a void-space where a single primitive — the bracket — breathes; scroll advances the briefing, the camera advances the space. Emotion target (Master Rule): security, seriousness, technology, discovery — "capable of anything," without theatre.

---

## 1 · External references

### 1.1 Lusion — Client Zero
URL: `https://client-zero-tech.lusion.co/`
Role: **primary DNA reference** for the 3D/scroll mechanism.

**What we take (structural / behavioral):**

- **Scroll as camera through a persistent 3D space.** Page height = 1× viewport. Native scroll disabled. Custom wheel/touch/keyboard handler intercepts input and advances a camera in **discrete narrative beats**. One input = one beat.
- **WebGL canvas fixed fullscreen** behind all DOM. UI floats over it. Content panels reveal per beat.
- **Top-bar composition**: mark top-left + central numbered chapter-nav.
- **Bottom-center scroll prompt** breathing.
- **Grace-note bracket-derivative icon** accompanying editorial annotations.
- **Sentence case refined display** + Inter body + mono chrome structure — the *slot pattern* is right, even though we swap the specific families.

**What we leave:**

- Their accent `#0DF6FF` (cyan) — Void uses ultramarine `#2B2BC2` only.
- Display font Neue Haas Unica 500 — Void uses Inter 900 per DS §1.2 (monumentality over neutral refinement).
- Chrome font IBM Plex Mono — Void uses JetBrains Mono per DS §1.2.
- Pure black `#000` — Void uses void `#030308` (has depth, not flatness).
- Pill-rounded CTAs — Void uses bracket-chamfered per DS §4.1.
- Product-marketing CTA language ("Launch ZERO", "Download App") — Void's CTA copy is locked from the current project.
- Live price ticker — Void has no price ticker; the figure-label `Fig. 001 · The Object` fills the editorial-chrome slot instead.

### 1.2 Geometry G3 — in-repo
File: `geometry-g3.html`
Role: **identity reference** for the geometry + typography grammar (bracket primitive, diagonal slash DNA, bracket-chamfer clip-paths, hatch textures, tick-terminated dividers, corner bracket glyphs).

The composition G3 shows (headline top-left / MetaBlock right) is **not adopted**, because the current project has no MetaBlock copy. Composition below is re-derived from the Lusion reference + the real locked copy inventory.

### 1.3 Bracket motion asset — deferred
File: `/Users/higor/Downloads/video-void-genesis.mp4` (6.5s construction sequence).
Role: DNA source for the 3D primitive (bracket self-construction). Motion ratio 30% chaos / 15% resolve / 55% breathe (per DS §11). Hero beat 1 = **breathe phase**. The construction phases (A, B) are reserved for entry animation and for later beats; they are not the resting state.

---

## 2 · Layout & structure

### 2.1 Permanent chrome (persists across every hero beat)

- Four bracket-corner SVGs at viewport corners, 28×28, 24px inset, color paper-dim (per DS §4.4). Replaces the current project's crosshair-style corners — DS §4.4 is the lock.
- **Running head** — three-column grid at top, 24px inset from top edge, 48px side gutter on desktop. All JetBrains Mono 400, 10.5–11px, tracking 0.24–0.30em, UPPERCASE.
  - **Left**: bracket mark (13×13) + wordmark `Void · Genesis` (paper).
  - **Center**: `— Silent Cinema · MMXXVI —` (paper-dim, tracking 0.30em).
  - **Right**: `Fig. 001 · The Object` (paper-dim, tracking 0.22em). This is the **editorial figure label** — it fills the role Lusion gave to the live-price widget. Increments per hero beat (`Fig. 002 · The Fracture`, `Fig. 003 · The Return`, etc., **when copy is authored for those beats**).

### 2.2 Chapter-nav — hybrid (LOCK)

Horizontal, 36px gap between items. Persistent across all hero beats, placed directly below the running head at 56px from viewport top. Copy for items `01–05` inherited from `src/components/nav.tsx`. Item `00` is the hero's own chapter (active on beat 1) — its label is pending the site-language decision (§9.1).

```
EN    00  OPENING     01  SERVICES      02  HOW WE WORK       03  THE METHOD    04  DEMOS    05  CONTACT
PT    00  INÍCIO      01  SERVIÇOS      02  COMO TRABALHAMOS  03  O MÉTODO      04  DEMOS    05  CONTATO
```

Each item = two spans, 8px gap:

| Part | Family | Weight | Size | Tracking | Color |
|---|---|---|---|---|---|
| `num` | JetBrains Mono | 400 | 10px | 0.22em | paper-ghost |
| `name` | JetBrains Mono | 500 | 10.5px | 0.22em | paper-dim → ultramarine on hover |

UPPERCASE throughout (matches the locked mono-chrome treatment in `nav.tsx`).

**Active state**, driven by the current beat's chapter:
- `name` → ultramarine;
- 1px ultramarine underline, 6px below baseline, width = name's text width;
- Clicking a nav item = scroll-jump to that chapter's first beat (using the standard 800ms beat-morph transition, not a snap).

### 2.3 CTA pair — NOT in top-bar

The top-bar carries the chapter-nav only. No top-bar CTA pair. CTAs live in the hero body (§2.4). Rationale: `Schedule a call` (from `nav.tsx`) and the in-body `Talk to Us` are adjacent intents; doubling them produces clutter. The top-bar stays silent, the body speaks.

### 2.4 Hero body — bottom-anchored foldout (LOCK)

Content stack anchored to the **bottom-left** of the viewport — inherited from the current project's composition (`hero.tsx`), which is a Silent-Cinema foldout reading like the credits card of a film. Upper half belongs to the 3D object; lower half belongs to the content.

Grid is single-column, `max-width: 760px`, `padding-bottom: clamp(80px, 10vh, 96px)`, `padding-left: clamp(32px, 6vw, 56px)`.

Stack order (top → bottom):

#### 2.4.1 Chapter mark

Format per DS §6.2 applied with locked copy strings:

```
[micro-bracket]  § 001  AI-Native Software Studio  ──────
```

- Micro-bracket glyph (10×10, paper-dim at 0.6 opacity) — leads the row.
- `§ 001` — JetBrains Mono 400, 10.5px, tracking 0.24em, paper-dim.
- `AI-Native Software Studio` — JetBrains Mono 400, 10.5px, tracking 0.24em, UPPERCASE, paper. This is the **studio identity label** (lifted verbatim from `hero.tsx`, line 120).
- Trailing divider line — 1px hair, flex-fill, max-width 140px.
- 12px gap between elements; entire row 8px margin-bottom to the headline.

Note: the current project renders the chapter mark as `[dot] LABEL ─── § 001` (label before number). DS §6.2 locks the canonical order to `§ NNN — LABEL`. The rewrite follows DS, using the same two locked strings (`§ 001` and `AI-Native Software Studio`) in DS's order.

#### 2.4.2 Headline (h1) — LOCK copy

```
Your software problem needs an architect.
```

(Verbatim from `hero.tsx` line 142–152.)

- Inter 900, `clamp(52px, 7.2vw, 112px)` — matches the current project's exact scale.
- `letter-spacing: -0.025em`, `line-height: 0.96`, sentence case, max 3 lines.
- **"an architect."** takes the ultramarine accent per DS §3.1. **No italic** (DS §1.2 rule). The current project renders it with `font-style: italic` + serif display — that is **retired by the BDE lock** (Inter 900 single-family system; italics and serifs disallowed).
- Ultramarine text glow is permitted as an exception to "no drop shadows" because it is a self-color emanation, not a cast shadow:
  `text-shadow: 0 0 40px rgba(43,43,194,0.45), 0 0 80px rgba(43,43,194,0.2);`
  Applied only to the accent phrase.

#### 2.4.3 Sub — LOCK copy

```
Not a developer. Not a template. A system engineered for how your business actually works.
```

(Verbatim from `hero.tsx` line 169–173.)

- Inter 400, 17px, `line-height: 1.55`, `max-width: 48ch`, `margin-top: 32px`.
- **First clause** (`Not a developer. Not a template.`) — paper-dim.
- **Second clause** (`A system engineered for how your business actually works.`) — paper, Inter 500. This split is the in-sentence emphasis pattern from the current project; preserved because it carries tonal weight.

#### 2.4.4 Detail — LOCK copy

```
Senior engineers direct every decision. AI drives the velocity. The result: three times faster delivery, zero regressions in production, and a team that doesn't disappear after launch.
```

(Verbatim from `hero.tsx` line 189–192.)

- Inter 300, 13.5px, `line-height: 1.65`, `max-width: 46ch`, `margin-top: 20px`, color `rgba(236,228,212,0.48)` (≈ paper at 48%).

#### 2.4.5 CTA pair — LOCK copy

- **Primary**: `See What We Build`
- **Secondary**: `Talk to Us`

(Verbatim from `hero.tsx` line 228, 259.)

Typography and treatment (upgraded to bracket-chamfered per DS §4.1):

- Both: JetBrains Mono 500, 11px, tracking 0.22em, UPPERCASE. Padding 14px × 28px.
- **Primary**: bracket-chamfered 10px clip-path, ultramarine fill, paper text. Hover → background `#3333e8` + box-shadow `0 0 48px rgba(43,43,194,0.45)` + `translateY(-1px)` (the lift-on-hover is retained from the current project).
- **Secondary**: bracket-chamfered 10px clip-path, 1px paper-dim inset stroke, paper text. Hover → stroke paper, background `rgba(236,228,212,0.04)`, hatch reveal at 0.08.
- Primary carries a trailing inline arrow `→` (Lucide `ArrowRight`, 13px, same color as label). Arrow translates +4px on hover.
- CTA row `margin-top: 40px`, gap 12px.

### 2.5 Right half of viewport — 3D object focal

The right half of the viewport is **DOM-silent**. The 3D object (the bracket at its breathe-phase) occupies this half of the frame. The scrim gradient from `hero.tsx` (62% bottom wash, 0.92 → 0 rgba) is retained — it lets the text land on legible ground while the 3D object dominates the upper two-thirds of the viewport.

### 2.6 Scroll prompt — LOCK copy

```
Scroll · Genesis
```

(Verbatim from `hero.tsx` line 284.)

- Horizontally centered at `bottom: 20px`, JetBrains Mono 400, 10px, tracking 0.32em, UPPERCASE, color paper at 28% opacity.
- Breathing animation — opacity `0.28 ↔ 0.70`, 2.6s ease-in-out, infinite.
- Hides immediately on first beat-advance input.

### 2.7 Bottom gradient transition

80px tall bottom-anchored gradient from `transparent` to `#000`, z-index 3, pointer-events none. Retained from the current project. In the new Lusion-style scroll model this becomes purely an aesthetic framing (there is no "next section scroll"), but it still reinforces the foldout/film-credit feel.

---

## 3 · Typography & copy (hero-specific table)

All slots inherit from DS §1.2 / §1.3. **All copy strings are locked from the current project.**

| Slot | Family | Weight | Size | Case | Tracking | Color |
|---|---|---|---|---|---|---|
| Headline | Inter | 900 | clamp(52, 7.2vw, 112) | sentence | -0.025em | paper; phrase `an architect.` → ultramarine |
| Chapter mark · bracket | — | — | 10×10 glyph | — | — | paper-dim @ 0.6 opacity |
| Chapter mark · number | JetBrains Mono | 400 | 10.5px | — | 0.24em | paper-dim |
| Chapter mark · label | JetBrains Mono | 400 | 10.5px | UPPERCASE | 0.24em | paper |
| Sub (part 1) | Inter | 400 | 17px | sentence | 0 | paper-dim |
| Sub (part 2) | Inter | 500 | 17px | sentence | 0 | paper |
| Detail | Inter | 300 | 13.5px | sentence | 0 | paper @ 48% |
| Chapter-nav number | JetBrains Mono | 400 | 10px | — | 0.22em | paper-ghost |
| Chapter-nav name | JetBrains Mono | 500 | 10.5px | UPPERCASE | 0.22em | paper-dim → ultramarine hover / active |
| Primary CTA | JetBrains Mono | 500 | 11px | UPPERCASE | 0.22em | paper on ultramarine |
| Secondary CTA | JetBrains Mono | 500 | 11px | UPPERCASE | 0.22em | paper on transparent, 1px paper-dim stroke |
| Running head · brand | JetBrains Mono | 400 | 10.5px | UPPERCASE | 0.24em | paper |
| Running head · motto | JetBrains Mono | 400 | 10.5px | UPPERCASE | 0.30em | paper-dim |
| Running head · figure | JetBrains Mono | 400 | 10.5px | UPPERCASE | 0.22em | paper-dim |
| Scroll prompt | JetBrains Mono | 400 | 10px | UPPERCASE | 0.32em | paper @ 28% (breathing to 70%) |

**Reinforced rules for the hero:**
- **No italics.** The current project renders `an architect.` italic-serif; the BDE retires that treatment. The phrase stays italic-free in Inter 900, ultramarine-accented, with the ultramarine glow (see §2.4.2).
- **No serifs.** Inter is the only display family.
- **No decorative underlines.** Underline is reserved for the active chapter-nav item.
- **One accent phrase per headline.**
- **`ultramarine` appears in the hero at most three times simultaneously**: once in the headline accent, once in the primary CTA fill, once on the active chapter-nav item (name color + underline).

---

## 4 · 3D / motion / ambient (the Lusion layer)

### 4.1 Scene architecture

- Single `<canvas>` fixed, `position: fixed; inset: 0; z-index: 0;`, full viewport.
- Renderer: Three.js (or WebGPU-backed equivalent). One persistent scene across all beats; nothing is destroyed, everything transforms.
- One key directional light + one rim light. Color temperature: cool. Ultramarine rim on bracket leading edge, paper-dim fill.
- Fog / falloff from `void` near focus out to pure `#000` at edges. Cinematic depth — not flat.
- No gradient backdrops. No glass-morphism blurs. No volumetric fog clichés.

### 4.2 The primitive — bracket as hero 3D object

Hero object is the **bracket mesh itself** (geometry source: DS §2.1 — outer + inner offset + 45° diagonal slash).

**Beat 1 (resting hero state):**
- Bracket positioned **right-of-center in the upper two-thirds** of the viewport, leaving the bottom-left foldout clear for the content stack.
- **Breathing loop**: scale `1.000 ↔ 1.008`, 6s ease-in-out, infinite. Barely perceptible.
- **Ambient field**: wave-interference particle field around the bracket, ultramarine at 8% opacity max, drifting slowly along a subtle orbital curve. Matches "Genesis chaos" DNA at **minimum intensity** — the hero is the breathe phase, not the chaos phase.
- **Rim light**: ultramarine-tinted, rakes the top-right chamfered corner of the outer bracket.
- **Diagonal slash** (G3 DNA): subtle inner slash visible across the bracket's negative space, at 0.15 opacity paper.

### 4.3 Scroll behavior — LOCK: Lusion-style discrete beats

- Page height = **1× viewport**. Native scroll disabled (`html, body { overflow: hidden; }`).
- Custom handler captures wheel, touch swipe, arrow keys, Space, Page Up/Down.
- **One input = one beat advance.** No partial beat state, no smooth-scroll-through.
- Debounce: 600ms between beats (prevents double-advance on noisy trackpads).
- Programmatic navigation (chapter-nav click) uses the same transition, not a hard snap.

### 4.4 Beat transition — reference pattern (hero → next chapter)

Duration 800ms end-to-end. Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for the camera; `ease` for DOM.

| Time | DOM | 3D | Chrome |
|---|---|---|---|
| 0ms | user input fires | | |
| 0–280ms | content exits: letters mask out bottom-up, meta fades to paper-ghost | bracket disassembles — outer layer tumbles into wave-interference fragments (Phase A: Genesis chaos) | scroll-prompt fades out (160ms) |
| 280–560ms | new content pre-roll: chapter-mark of beat 2 begins fade-in | inner layer tilts and recedes; camera begins its arc toward beat 2's focal point | |
| 400–800ms | new content stagger-in: chapter-mark → headline → sub → detail → CTA, 120ms between each | beat 2's 3D primitive resolves (Phase B: Resolution) and settles into its breathe (Phase C) | chapter-nav underline slides 01 → 02 (260ms); running head figure label updates (Fig. 002 · …) |
| 800ms | settle | scene at rest; ambient field at minimum | scroll-prompt re-enters if the new beat is not the last |

Reverse (scroll-back): symmetric.

### 4.5 Execution reality — trial & error acknowledged

The 3D specification above is **directional**, not numerically final. These parameters require build-and-iterate against the Master Rule:

- Exact material / shader for the bracket (metallic clearcoat? matte with rim? SDF raymarched?).
- Particle count and density of the ambient field.
- Fog fall-off curve and color stops.
- Breathing frequency and amplitude.
- Transition easing curves (especially camera arc).
- Motion intensity for `prefers-reduced-motion`.
- Bracket's exact 3D depth — shallow extrusion vs volumetric.

These are tuned in the built page. If the resting bracket reads "like a logo placed on a page," the material and rim light are wrong and must be iterated before shipping.

---

## 5 · States

### 5.1 Load / entry (first paint)

- Server-side renders a **static initial frame**: bracket mesh at rest, full DOM content visible. No visible loader, no preload screen, no apology text.
- Client-side hydration starts the 3D scene; if it fails, the static frame remains as fallback (see §5.7).
- Entry choreography (inherited from `hero.tsx` — timings already validated):
  - Running head fades in at T+400ms (1.4s duration).
  - Chapter mark slides in from -10px at T+650ms (0.9s).
  - Headline rises from +18px at T+900ms (1.0s).
  - Sub rises from +14px at T+1100ms (0.85s).
  - Detail rises from +12px at T+1300ms (0.8s).
  - CTA pair rises from +10px at T+1500ms (0.8s).
  - Scroll prompt fades in at T+1800ms (1.2s).
- 3D ambient field drift begins at T+800ms. Breathing loop begins at T+1200ms.

### 5.2 Idle (beat 1 resting)

- Bracket breathes at 6s period.
- Ambient field drifts at minimum intensity.
- Chapter-nav `01 SERVICES` is **not** in active state — the hero is the prologue, not `Services`. Active-state begins at beat 2 or later. (Alternative: add a `00 OPENING` prefix item at the chapter-nav if desired. Deferred — awaiting copy and user decision.)
- Scroll-prompt breathes (opacity 0.28 ↔ 0.70, 2.6s).

### 5.3 Beat advance (exit)

Per §4.4. Scroll-prompt hides immediately on first input.

### 5.4 Hover

- Nav item: name paper-dim → ultramarine, 220ms ease.
- Primary CTA: background ultramarine → `#3333e8`, box-shadow `0 0 48px rgba(43,43,194,0.45)`, `translateY(-1px)`, 400ms ease.
- Secondary CTA: border paper-dim → paper, background → `rgba(236,228,212,0.04)`, hatch reveal at 0.08, 400ms ease.
- Running head / MetaBlock: no hover state.

### 5.5 Focus

- Any interactive: 1px ultramarine outline at 2px offset (per DS §8).

### 5.6 Reduced motion — `prefers-reduced-motion: reduce`

- 3D scene renders but does not animate: no breathing, no ambient drift, no beat morph.
- Beat advance degrades to cross-fade only (opacity, no transform, no 3D morph, 280ms).
- Entry choreography shortens to single 400ms fade-in (no stagger).
- Scroll prompt does not breathe — opacity fixed at 0.5.

### 5.7 No WebGL / unsupported

- Canvas is omitted; the hero renders as **pure DOM** with the exact same copy and typography.
- Beat navigation degrades to native vertical scroll (page height becomes content height, sections stack per G3 pattern).
- No apology banner. No "upgrade your browser" message. The static hero IS the Void hero for these users.

---

## 6 · Master Rule — hero-specific validation

The hero is validated when **all three** conditions hold on the rendered page of the next project:

1. **First 5 seconds produce (unprompted) at least one of**: security / seriousness / technology / discovery / "capable of anything."
2. **Scroll from beat 1 → beat 2 feels like "traveling inside the space,"** not "clicking through slides." If the user describes it as "pages" or "sections transitioning," the 3D morph is under-tuned.
3. **The bracket reads as the brand speaking for itself** — not a logo placed on a page. If the user says "nice logo, nice background" (as two separate things), the bracket's integration into the 3D scene is under-tuned.

If any condition fails, iterate on §4.5 parameters before touching the DOM or typography. Composition is locked; the 3D execution is the variable.

---

## 7 · Anti-patterns — hero-specific

In addition to DS §10:

- No video backdrop (abstract cinematic stock-reel). Cinema lives in the 3D primitive, not filmed content.
- No hero slider / carousel. Beats are narrative, not rotating pitches.
- No bouncing scroll-arrow cliché. Scroll prompt breathes; does not bounce.
- No 3D text rendered as headline. Headline is DOM, always.
- No particle explosion behind the headline as pure decoration. Particles appear only around the bracket, derived from the bracket, motivated by a beat.
- No parallax on the headline during scroll. Headline sits still; space moves behind it.
- No "AI-generated futurism" (cyan-to-purple gradients, glass-morphism, holograms, lens flares). Silent Cinema, not demo reel.
- No currency ticker, price widget, or live marketplace strip.
- No chat bubble / chatbot launcher in the hero viewport.
- No testimonial / logo-cloud strip in the hero. Hero ends at beat 1's viewport edge.
- No time-based auto-advance of beats. Advance is always user-initiated.
- **No copy authoring in this document.** Any new slot without existing copy is either dropped or marked "awaiting copy" — never filled with filler.

---

## 8 · Small viewports

Breakpoint: under 768px width.

- Page gutter collapses to 24–32px (matches current `px-8` / `px-12` responsive range).
- Running head: columns stack vertically at breakpoint, or center column hides and only brand-left + figure-right remain. Proposal: **hide center motto under 768px, keep brand + figure**. DS §12 Q3 awaiting user decision.
- Chapter-nav: collapses behind a `◇` menu affordance (the `<Menu />` icon in the current `nav.tsx`) — the numbered items appear in a dropdown overlay.
- Hero grid is already single-column at desktop (the 3D object is the right half implicitly; content is the left half) — on mobile, the 3D object becomes the full background of the upper half, content stack anchors at `pb-20` (80px) from the bottom.
- Headline clamps downward (`clamp(40px, 9vw, 64px)`).
- 3D: same scene, reduced particle count (50% density target) for mobile GPUs. Beat morph timings unchanged.
- Touch: one swipe up = advance beat; swipe down = reverse. Vertical pan threshold 40px.

---

## 9 · Open items — status

Locked items are absorbed into the spec above. Items marked *deferred* are iterated at build time against the Master Rule or require a product-level decision.

**Locked:**

- **Chapter-nav gains a `00` prefix item** so the hero carries an active-state during its own beat. The active item on beat 1 is `00`. Label copy pending site-language decision (see §9.1).
- **Keyboard shortcuts for beat navigation.** `Space` / `ArrowDown` / `PageDown` = advance; `ArrowUp` / `PageUp` = reverse; `1`–`5` = jump to chapter N. (After the `00` prefix lands, `0` = jump to hero.)
- **Audio cue on beat advance — none.** Silent Cinema is literally silent. The hero ships without audio in any form.
- **3D stack — performance-first, hybrid acceptable.** The essential premise is that it runs well. One core renderer is chosen (Three.js, R3F, or OGL) and supporting libraries are composed around it when they buy clearly more quality or clearly more performance than the core alone. No stack is mandated at the brand level; the product team selects per shipping constraints and validates against Master Rule §6. Bundle size, frame pacing on mid-range laptops, and graceful degradation (§5.6, §5.7) are non-negotiable acceptance criteria.

**Deferred (build-time tuning):**

- Exact bracket material / shader.
- Ambient field particle count, drift vector, opacity curve.
- Beat count within the hero chapter (default 1; may need 2–3 sub-beats for narrative depth — but only if additional copy exists to populate them).

**Deferred (product decision):**

- Whether the existing `Schedule a call` copy (from `nav.tsx`) is promoted to a persistent top-bar CTA at later beats (post-hero), or remains in the collapsed global nav only.
- Small-viewport treatment of running head center column — resolved at DS §12 Q3 (usability-first: hide when illegible).

### 9.1 Site language — i18n (PT + EN)

The site ships bilingual: **Portuguese (pt-BR)** and **English (en)** via i18n. The original locked copy from `void-genesis-web/` is the English source-of-truth; the Portuguese counterpart is translated from it with editorial care (not literal translation — the Silent Cinema tone must survive in PT).

Every copy string in this document is now paired:

| Slot | EN (locked, source) | PT (locked) |
|---|---|---|
| Chapter mark label | `AI-Native Software Studio` | `Estúdio de Software AI-Native` |
| Headline | `Your software problem needs an architect.` | `Seu problema de software precisa de um arquiteto.` |
| Headline accent (ultramarine) | `an architect.` | `um arquiteto.` |
| Sub (part 1) | `Not a developer. Not a template.` | `Não é um desenvolvedor. Não é um template.` |
| Sub (part 2) | `A system engineered for how your business actually works.` | `Um sistema projetado para como sua empresa realmente funciona.` |
| Detail | `Senior engineers direct every decision. AI drives the velocity. The result: three times faster delivery, zero regressions in production, and a team that doesn't disappear after launch.` | `Engenheiros sênior conduzem cada decisão. IA acelera a velocidade. O resultado: entregas três vezes mais rápidas, zero regressões em produção, e um time que não desaparece depois do lançamento.` |
| Primary CTA | `See What We Build` | `Veja o Que Construímos` |
| Secondary CTA | `Talk to Us` | `Fale Conosco` |
| Scroll prompt | `Scroll · Genesis` | `Rolar · Genesis` |
| Chapter-nav 00 | `OPENING` | `INÍCIO` |
| Chapter-nav 01 | `SERVICES` | `SERVIÇOS` |
| Chapter-nav 02 | `HOW WE WORK` | `COMO TRABALHAMOS` |
| Chapter-nav 03 | `THE METHOD` | `O MÉTODO` |
| Chapter-nav 04 | `DEMOS` | `DEMOS` |
| Chapter-nav 05 | `CONTACT` | `CONTATO` |
| Running head · brand | `Void · Genesis` | `Void · Genesis` (invariant) |
| Running head · motto | `— Silent Cinema · MMXXVI —` | `— Silent Cinema · MMXXVI —` (invariant — brand grammar) |
| Figure label | `Fig. 001 · The Object` | `Fig. 001 · O Objeto` |

**Storage — canonical source.** Estas strings vivem em `locales/en.json` e `locales/pt.json` no projeto. O HERO.md é o documento normativo; o JSON é a fonte operacional consumida pelo `next-intl` em runtime. Se divergirem, o HERO.md vence — atualizar o JSON pra bater com a tabela acima.

**Invariants — never translated:**

- The word `Void`, the bracket mark, the year in Roman numerals (`MMXXVI`), reference codes (`VG-YY-D01`), chapter-mark format (`§ 001`), figure format (`Fig. NNN ·`), the mono middot separator `·`.

**Typographic considerations for PT:**

- PT words average longer than EN. All copy slots must re-test against `max-width` rules — especially sub at `48ch` and detail at `46ch`. Wrap points shift; headline line breaks must be re-composed by hand in PT, not auto-wrapped.
- Accented characters (`ç á é í ó ú ã õ ê`) must render crisply in Inter 900 and JetBrains Mono — both families cover Latin Extended-A. Verify at display sizes during build.
- UPPERCASE mono-chrome in PT keeps accents (`SERVIÇOS`, not `SERVICOS`). Tracking `0.22em` remains.

**Locale resolution — locked (per DS §1.5):**

- On first visit the locale is detected from the browser's `Accept-Language` (`pt*` → pt-BR, `en*` → en). A visible switcher is always present; user override is persisted and wins over detection on subsequent visits.
- The switcher visual treatment is the standard from DS §1.5 — mono, `PT · EN`, no icons / no flags, active locale in `paper`, inactive in `paper-ghost`.

**Switcher placement — hero-level proposal, locked unless contested:**

Appended to the chapter-nav row, right-aligned, separated from `05 CONTACT` by the mono middot (`·`) separator and a 36px gap. This keeps it inside the navigation chrome (one horizontal band, already mono-styled) without adding a fourth column to the running head.

```
00 OPENING   01 SERVICES   02 HOW WE WORK   03 THE METHOD   04 DEMOS   05 CONTACT          PT · EN
```

**Locked decisions:**

1. **Fallback locale → `en`.** When the browser's `Accept-Language` is neither `pt*` nor `en*` (e.g. `de-DE`, `ja-JP`), the site falls back to English. Rationale: EN is the more neutral international fallback; PT remains the first-class choice for `pt*` browsers.
2. **URL strategy → locale-prefixed.** Routes are always `/pt/...` and `/en/...`. No default-unprefixed tree. The root `/` redirects to `/pt` or `/en` based on the detection rules (DS §1.5). Chosen for SEO (Google indexes each locale as a distinct URL) and shareable links (a URL carries its language).
3. **Chrome labels translate.** Mono-chrome labels follow the locale (`REF · LOCAL · STATUS · EDIÇÃO` in PT). Invariants from DS §1.5 still never translate (`Void`, `MMXXVI`, `§ NNN`, `Fig. NNN ·`, `VG-YY-DNN`, the middot `·`).

**Translation storage:** flat JSON dictionaries in the project (`locales/pt.json`, `locales/en.json`). Implementation library is left to the project-level stack decision; the brand-level contract is only the dictionary-per-locale shape.

**Copy-authoring status — complete.** All PT translations are locked in the table at the top of this section and mirrored in `locales/pt.json`. No pending copy work.

---

*End of hero spec. All copy is locked verbatim from the current `void-genesis-web` codebase. 3D execution iterates until §6 is met.*
