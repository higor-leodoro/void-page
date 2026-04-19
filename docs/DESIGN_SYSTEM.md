# Void — Design System

> Silent Cinema edition · MMXXVI
>
> Consolidation of the Brainstorm Design Extraction (BDE) method applied to the Void studio identity. This document is **brand-level** and **platform-agnostic**. It defines the visual and compositional language that every Void product — marketing sites, applications, internal tools, deliverables — inherits and respects.
>
> For translating this spec into a specific codebase, each project maintains its own implementation document.

---

## 0 · Thesis

Void is an AI-native studio. Every surface Void ships is a **briefing document**, not a brochure. A visitor is being briefed; listings are mission specs; points of contact are deployment authorizations. The visual language must convey **security, seriousness, technology, discovery** — "capable of anything," without theatre.

Visual genre: **Silent Cinema**. Cinematic atmosphere held inside monograph discipline. Editorial grammar with technical instrument details.

Two principles govern every decision:

1. **The mark speaks.** The bracket carries the brand alone. No wordmark is required to identify Void. Apple-principle.
2. **Every detail descends from the bracket.** Geometry, hatching, divider terminations — all derive from the logo's own shape. The brand is the primitive, not decoration layered on top.

---

## 1 · Tokens

### 1.1 Color

| Token | Hex | Usage |
|---|---|---|
| `void` | `#030308` | Primary background. The absolute. Never lighter, never tinted. |
| `paper` | `#ECE4D4` | Primary text, primary marks, primary interactive elements. |
| `paper-dim` | `#8A8476` | Secondary text, meta values, default divider hairline, default icon stroke. |
| `paper-ghost` | `#4A463F` | Tertiary text, inactive states, low-emphasis meta. |
| `ultramarine` | `#2B2BC2` | Accent only. Used for: single keyword in headlines, primary CTA background, hover-state title color, chapter-mark dot, selection. One accent per screen region. |
| `hair` | `rgba(138, 132, 118, 0.14)` | Default hairline dividers. |
| `hair-strong` | `rgba(138, 132, 118, 0.32)` | Specimen frame borders, divider tick terminations, focused borders. |

**Rules:**
- No gradients except the logo's own metallic render (reserved for motion phase).
- No drop shadows, no elevation, no blur — except backdrop-blur on floating legends.
- `ultramarine` appears **once per viewport region** — never as filler or decoration. It is the only color allowed to carry attention.
- Dark surface only. There is no light mode.

### 1.2 Typography

| Role | Family | Weight | Case | Tracking |
|---|---|---|---|---|
| Display / headlines | Inter | 900 | Sentence | -0.03em |
| Ritual / manifesto | Inter | 900 | **UPPERCASE** | -0.02em |
| Section titles | Inter | 900 | Sentence | -0.03em |
| Editorial list titles | Inter | 700 | Sentence | -0.015em |
| Body | Inter | 400, 500 | Sentence | 0 |
| Chrome (labels, buttons, tags, metadata, chapter marks) | JetBrains Mono | 400, 500 | **UPPERCASE** | 0.22em |
| Micro chrome (specimen refs, folios) | JetBrains Mono | 400 | **UPPERCASE** | 0.28em |

**Rules:**
- **No serif** anywhere in the system.
- **No italics** anywhere. If emphasis is needed, use color (`ultramarine`) or UPPERCASE.
- **No hand-writing gestures** — nothing is cursive, nothing is ornamental.
- Ritual UPPERCASE is reserved for act openings and the name "Void" in manifesto moments. Max **4 occurrences per page**.

### 1.3 Type scale

Fluid, clamp-based:

```
type-mega:   clamp(64px, 9.5vw, 152px)   hero headline
type-large:  clamp(44px, 6vw,   88px)    section titles, rituals
type-medium: clamp(28px, 3vw,   42px)    specimen titles
type-body:   15px                         body copy
type-small:  13px                         detail copy
type-mono:   11px                         chrome labels
type-micro:  10px                         folios, refs
```

### 1.4 Spacing

Rhythm is multiples of **8px**. Default section padding: **140px top / 80px bottom** on desktop, **96px / 56px** on small viewports. Page gutter: **56px** desktop, **24px** small. Page frame inset (corner brackets): **24px** from viewport edge on all sizes.

### 1.5 Language & i18n

The brand surface ships **bilingual**: `pt-BR` and `en`. Translation is editorial, not literal — the Silent Cinema tone is preserved before grammatical fidelity.

**Invariants (never translated):**

- The word `Void` and the bracket mark.
- Roman-numeral years (`MMXXVI`).
- Reference codes (`VG-YY-DNN`), chapter-mark format (`§ NNN`), figure-label format (`Fig. NNN ·`).
- The mono middot separator `·`.

**Mandatory per locale pass:**

- Headline line breaks are re-composed by hand per locale; PT words average longer and will wrap differently at a given `max-width`.
- `max-width: 60ch` (body) and per-slot `ch` constraints are re-tested in each locale — not blindly inherited.
- UPPERCASE mono labels keep their accents in PT (`SERVIÇOS`, `EDIÇÃO`). Tracking rules in §1.2 unchanged.
- Inter and JetBrains Mono both cover Latin Extended-A. Verify crisp rendering of `ç á é í ó ú ã õ ê` at display sizes during implementation.

**Locale resolution:**

1. **First visit** — detect the browser's `Accept-Language`. Match the primary tag (`pt*` → pt-BR; `en*` → en). If neither matches, fall back to the **product-level default locale** (pending decision, §9.1).
2. **User override** — a visible locale switcher in the UI lets the visitor swap locales at any time. The choice is persisted (cookie or localStorage) and wins over browser detection on subsequent visits.
3. **Switcher visual treatment** — mono, UPPERCASE, 10.5px, `PT · EN` format. The active locale is in `paper`; the inactive in `paper-ghost`. Hover → `paper-dim`. No icon, no flag emoji. Placement is project-specific (see hero spec §9.1).

**Locked at brand level:**

- **Fallback locale → `en`** when the browser's `Accept-Language` matches neither `pt*` nor `en*`.
- **URL strategy → locale-prefixed** (`/pt/…` and `/en/…`). The root `/` redirects to the resolved locale.
- **Chrome-label translation → translate** (`REF · LOCAL · STATUS · EDIÇÃO`). Invariants above still never translate.
- **Translation storage → flat JSON dictionaries** per locale in the project (`locales/pt.json`, `locales/en.json`). i18n library is a project-level choice.

### 1.6 Grid & breakpoints

| Breakpoint | Width | Columns | Gutter | Container max |
|---|---|---|---|---|
| `sm` | ≥ 640px | 4 | 16px | 100% |
| `md` | ≥ 768px | 8 | 20px | 100% |
| `lg` | ≥ 1024px | 12 | 24px | 100% |
| `xl` | ≥ 1280px | 12 | 24px | 1440px |
| `2xl` | ≥ 1440px | 12 | 24px | 1440px |

- Canonical container max-width: **1440px**. Beyond that, the page frame holds; content does not keep growing.
- 12 columns is the target for editorial layouts (specimen frames, editorial lists, meta blocks). Narrower breakpoints collapse to fewer columns as noted.
- Column math respects the 8px rhythm (gutters at 16/20/24 are all multiples).

---

## 2 · The Bracket

The bracket is the single mark of Void. It replaces any wordmark. It carries the brand alone.

### 2.1 Geometry

Square outline with two opposite chamfered corners (top-right, bottom-left). An inner offset bracket creates the signature dual-layer signature seen during motion.

```svg
<!-- Outer bracket -->
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
  <path d="M 10 1 L 25 1 L 31 7 L 31 22 L 22 31 L 7 31 L 1 25 L 1 10 Z"/>
  <!-- Inner offset bracket -->
  <path d="M 14 8 L 24 8 L 24 18 L 18 24 L 8 24 L 8 14 Z"/>
  <!-- Diagonal slash at chamfer corners (G3 treatment, optional) -->
  <path d="M 22 10 L 10 22" stroke-width="0.8" opacity="0.6"/>
</svg>
```

### 2.2 Sizes and contexts

| Variant | Dimensions | Context |
|---|---|---|
| `micro` | 10 × 10 | Chapter marks, inline inside mono labels |
| `small` | 14 × 14 | Row markers in editorial lists |
| `nav` | 28 × 28 | Navigation, paired with 14px wordmark |
| `footer` | 48 × 48 | Footer colophon, paired with 20px wordmark |
| `hero` | rendered via motion sequence | Prologue, motion phase only |
| `favicon` | 32 × 32 | Solid, single-path, no inner offset |

### 2.3 Rules

- Never appears next to the text "Void Genesis" below it. The mark IS the name.
- Never fills with `ultramarine`. Stays monochrome (`paper`, `paper-dim`, or `paper-ghost`).
- Never rotates statically. Rotation is reserved for motion phase.
- Never rounded. Corners are crisp always.
- Never co-appears with any other brand mark.

---

## 3 · Typography in context

### 3.1 Headlines (sentence case + accent)

```
We build
software like
an architect.   ← last phrase takes ultramarine
```

Line-height `0.92`. Letter-spacing `-0.03em`. One accent phrase per headline, at the end or the emphasis point.

### 3.2 Rituals (UPPERCASE, max 4 per page)

Reserved for act openings and manifesto moments.

```
— ACT I · THE NAME —

"VOID" — THE SPACE BEFORE CREATION.
"GENESIS" — THE ACT OF BRINGING SOMETHING INTO EXISTENCE.
```

Weight 900. Line-height `1.0`. Letter-spacing `-0.02em`. Curly quote marks. Defined noun takes `ultramarine`.

### 3.3 Section titles

Sentence case Inter 900, paired above with a chapter mark and below with a hairline divider ending in a bracket tick.

### 3.4 Body

Inter 400 at 15px. Line-height `1.55`. Max width `60ch`. `paper-dim` for detail copy, `paper` for primary body.

### 3.5 Chrome (JetBrains Mono)

ALL-CAPS, tracking `0.22em`, weight 400. Used for:

- Buttons (`SEE WHAT WE BUILD →`)
- Meta labels (`REF`, `LOCATION`, `STATUS`, `EDITION`)
- Chapter marks (`§ 001 — OPENING`)
- Specimen captions (`S-D · 01 — AUTOFLOW ● LIVE`)
- Folio page numbers (`01 / 09`)
- Tags, categories, status indicators

---

## 4 · Geometry primitives (G3)

### 4.1 Bracket cut-corner

Opposite-corner chamfers produce the bracket silhouette. Applied to buttons, specimen frames, badges, floating legends — any boxed element with primary emphasis.

```css
/* 10px chamfer on small elements */
clip-path: polygon(
  10px 0,
  100% 0,
  100% calc(100% - 10px),
  calc(100% - 10px) 100%,
  0 100%,
  0 10px
);

/* 16px chamfer on medium elements */
clip-path: polygon(
  16px 0,
  100% 0,
  100% calc(100% - 16px),
  calc(100% - 16px) 100%,
  0 100%,
  0 16px
);
```

### 4.2 Diagonal hatch

Derives from the bracket's internal negative space. Ambient presence only — never loud.

```css
background-image: repeating-linear-gradient(
  45deg,
  transparent 0,
  transparent 7px,
  rgba(236, 228, 212, 0.035) 7px,
  rgba(236, 228, 212, 0.035) 8px
);
```

Opacity values:

| Context | Opacity |
|---|---|
| Ambient (specimen frame interior) | 0.035 |
| Hover reveal (editorial row) | 0.06 |
| Active reveal (button hover) | 0.08 |
| Loading state | 0.1 |

Angle is always `45deg`. The bracket dictates direction.

### 4.3 Divider tick terminations

Every hairline divider terminates with a diagonal corner tick on the right:

```css
.divider::after {
  content: "";
  position: absolute;
  bottom: -1px;
  right: 0;
  width: 10px;
  height: 10px;
  border-right: 1px solid var(--hair-strong);
  border-bottom: 1px solid var(--hair-strong);
}
```

Section-block dividers use a repeating tick pattern every 56px:

```css
background-image: repeating-linear-gradient(
  45deg,
  transparent 0,
  transparent 48px,
  var(--hair-strong) 48px,
  var(--hair-strong) 49px,
  transparent 49px,
  transparent 56px
);
```

### 4.4 Page frame corners

Bracket-corner glyph at each viewport corner, 28 × 28, 24px inset, color `paper-dim`.

```svg
<path d="M 28 1 L 8 1 L 1 8 L 1 28" />
<path d="M 14 1 L 6 8 M 14 14 L 1 14" opacity="0.5" />
```

### 4.5 Hover hatching reveal

On interactive rows, hover reveals a subtle ultramarine-tinted diagonal wash. Concurrent with hover: row shifts right 14px, title color transitions to `ultramarine`, row's bracket icon lights to ultramarine.

```css
.row::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0,
    transparent 12px,
    rgba(43, 43, 194, 0.06) 12px,
    rgba(43, 43, 194, 0.06) 13px
  );
  opacity: 0;
  transition: opacity 260ms ease;
}
.row:hover::before { opacity: 1; }
```

---

## 5 · Iconography

**Recommended library:** Lucide — open-source, comprehensive, stroke-based geometry that pairs naturally with the hairline divider language.

**Defaults:**

- `stroke-width` 1.25 (hairline, matches divider weight)
- Size: 16, 20, or 24 only — never free-sized
- Color inherits from parent (`currentColor`)
- Stroke only; no fill

**Bracket-DNA custom set (future):** 10–12 core recurring icons (arrow, plus, minus, close, check, chapter, status, mission marker, specimen marker) derived from bracket geometry — 45° chamfers, matching stroke weight. Until the custom set exists, Lucide covers the full inventory.

---

## 6 · Page anatomy

### 6.1 Page frame

Permanent chrome across all routes:

- Four bracket-corner SVGs at viewport corners (24px inset)
- Running head top-center: `VOID · GENESIS · MMXXVI` (or project-equivalent), mono, `paper-dim`
- Page frame is fixed position; does not scroll.

### 6.2 Chapter marks

Format: `[micro-bracket] § NNN — LABEL`

```
◇  § 001 — OPENING
◇  § 002 — THE NAME
◇  § 003 — PRACTICE
```

Chapter numbers are sequential, zero-padded to 3 digits. Labels are ALL-CAPS, concise (1–3 words). Each section opens with exactly one chapter mark.

### 6.3 Section heads

```
[chapter mark]                              [range label: S · 01 → S · NN]
[section title Inter 900]
─────────────────────────────────[tick]
```

Hairline divider terminates with a diagonal tick.

### 6.4 Specimen frames

For showcasing work or demos:

```
[S-D · NN — NAME ● STATUS]              [REF · VG-YY-DNN]
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐  ← bracket-chamfered corners
                                        ← ambient 45° hatch at 0.035
   SPECIMEN NAME (Inter 900 42px)
   Body description, 60ch max.

   [01 · CATEGORY]      [— INSTRUMENT TAG —]
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

Caption row above the frame: specimen ID + status (`●` live, `○` archived, `◐` development). Reference number right-aligned. Frame uses 16px bracket chamfer + ambient 45° hatch at 0.035.

### 6.5 Editorial lists

Grid: `60px 1fr 1fr 160px 24px` (num / title+subtitle / detail / category / bracket marker).

```
S · 01   AI-native Products         Applications built around        Product    ◇
         End-to-end systems         language models, agents…
─────────────────────────────────────────────────────────[tick]
```

Row hover: padding-left +14px, title → ultramarine, bracket marker → ultramarine, diagonal hatch reveal at 0.06.

### 6.6 Meta blocks

Right-side stacked data panel, 4 rows:

```
REF         VG-YY · CONTEXT
LOCATION    WORLDWIDE · REMOTE
STATUS      OPEN · ACCEPTING WORK
EDITION     YEAR-ROMAN · EDITION NN
```

Labels in mono at `paper-ghost`, values in mono at `paper-dim`.

### 6.7 Folios

Page-indicator mono label bottom-right of each section: `NN / TOTAL`. Forms an implicit table of contents.

---

## 7 · Components (roles)

Component names and roles. Each project implements these in its own stack.

| Component | Role | Variants |
|---|---|---|
| **Bracket** | Brand mark glyph | `solid`, `outline`, `micro`, `nav`, `footer`, `favicon` |
| **ChapterMark** | Section-opener annotation (`§ NNN — LABEL`) | inline |
| **Button** | Primary interactive element | `primary` (ultramarine fill), `secondary` (outline) |
| **SpecimenFrame** | Artifact showcase container with caption row | default |
| **EditorialRow** | Sequential list row with hover hatch reveal | default |
| **MetaBlock** | Right-side stacked data panel | default |
| **Divider** | Horizontal separator with tick termination | `hairline`, `tick-row` (periodic ticks) |
| **PageFrame** | Fixed viewport chrome (corners + running head) | default |
| **Folio** | Section page-number indicator | default |
| **Nav** | Top navigation with bracket mark + link set | default |
| **FooterColophon** | Three-column footer (mark / centered imprint / contact) | default |

---

## 8 · Interaction patterns

All transitions: `220ms ease` for hover, `260ms ease` for hatch reveals, `400ms ease-out` for state changes.

**Hover:**

- Editorial row: padding-left +14px, title → `ultramarine`, bracket marker → `ultramarine`, hatch reveal 0.06
- Button (secondary): border `paper-dim` → `paper`, hatch reveal 0.08
- Button (primary): background `ultramarine` → `#3333e8`
- Nav link: color `paper-dim` → `paper`

**Focus:**

- Inputs: border-bottom 1px `paper-dim` → `ultramarine`
- Any interactive: 1px outline offset 2px in `ultramarine` (accessible focus ring)

**Loading (no motion yet):**

- Skeleton: 45° hatch at 0.1 opacity filling the reserved space
- Inline spinner: static bracket at 60% opacity, breathe keyframe (0.6 → 1.0 → 0.6, 2s infinite)

**Text selection — globally disabled.**

The entire site applies `user-select: none`. `::selection` styles are irrelevant because no text is selectable. Rationale: the site is a briefing document; it is read, not harvested. Contact values (email, phone) that users may genuinely need to copy will be delivered through explicit copy-to-clipboard affordances, not native selection.

```css
html, body, * { user-select: none; -webkit-user-select: none; }
```

Applies to form inputs as an exception — `<input>`, `<textarea>`, `[contenteditable]` retain native selection for usability.

---

## 9 · Copy conventions

### 9.1 Ritual moments

Uppercase Inter 900. Max 4 per page. Examples:

- `"VOID" — THE SPACE BEFORE CREATION.`
- `"GENESIS" — THE ACT OF BRINGING SOMETHING INTO EXISTENCE.`
- `— ACT I · THE NAME —`
- `— ACT FINAL · THE RESULT —`

### 9.2 Chapter labels

1–3 words, ALL-CAPS, mono. Examples: `OPENING`, `THE NAME`, `PRACTICE`, `WORK`, `STUDIO`, `ACCESS`, `RESULT`, `COLOPHON`.

### 9.3 Specimen captions

Format: `S-D · NN — NAME ● STATUS`. Reference: `REF · VG-[YY]-D[NN]`. Example: `REF · VG-26-D01`.

### 9.4 Meta values

ALL-CAPS, mono, middot separators: `WORLDWIDE · REMOTE`, `OPEN · ACCEPTING WORK`, `MMXXVI · EDITION 01`.

### 9.5 Roman numerals for years

Year appears as MMXXVI (2026) site-wide. Never `2026`. Editorial grammar requires it.

---

## 10 · Anti-patterns (never)

- No cards with borders and padding as containers — use specimen frames or editorial lists.
- No rounded corners anywhere. Radius is 0 in every context.
- No drop shadows. No box-shadow except internal borders for clip-path elements.
- No serif fonts. Ever.
- No italics. Ever.
- No emoji in UI or copy.
- No center-aligned body paragraphs (only closing ritual statements).
- No gradient fills on flat elements (gradients belong to metallic bracket during motion only).
- No decorative underlines. Links get color change, not underline.
- No card-hover lift (transform + shadow). We use padding-left shifts and hatch reveals.
- No light theme. No high-contrast mode beyond what the base palette already is.
- No "AI generated" aesthetic: no gray-to-black gradients, no generic Inter/Space Grotesk paired with orbs, no glass-morphism blur stacks.
- No icons at default weight (stroke-width 2). Always 1.25.

---

## 11 · Motion

Motion is treated as a discrete, deferred phase. The reference motion asset is the bracket self-construction sequence (6.5s total duration).

### 11.1 Structure

Three active phases + dissolution:

| Phase | Share of duration | Character |
|---|---|---|
| A — Genesis chaos | ≈ 30% | Wave-interference fragments tumbling in 3D |
| B — Resolution | ≈ 15% | Offset layers converge into bracket form |
| C — Hold metallic | ≈ 55% | Bracket stabilizes with subtle metallic sheen |
| D — Dissolution | short trailing | Fades to void |

### 11.2 DNA for product-wide motion

1. **Wave-interference** as motif for loading, transitions, ambient fields.
2. **Offset layering** — dual bracket copies with minimal rotation — as signature detail.
3. **Diagonal slashes** (already propagated into static G3 geometry).
4. **Timing ratio: 30% chaos / 15% resolve / 55% breathe.** Governs any transition longer than 400ms.

### 11.3 Per-product decisions

Each Void product revisits these when integrating motion:

- Full sequence on first load vs abbreviated resolve-only on return navigation.
- Metallic sheen scope: hero-only or ambient in-nav breathing.
- Relationship with any atmospheric particle field (replace vs layer).

---

## 12 · Open questions — status

Status log of the refinement questions. Locked items have been absorbed into the spec above; deferred items remain open at the brand level.

1. **Favicon geometry.** *Status: deferred.* Revisit when the site is ready to ship.
2. **Arrow glyphs.** *Status: locked — Lucide.* Inline arrows in CTAs use Lucide `ArrowRight` at `stroke-width: 1.25`, size matched to the label's x-height. Unicode `→` is not used.
3. **Running head on small viewports.** *Status: locked — usability-first.* Preserved when it reads cleanly; hidden outright when it compromises legibility or tap targets below 768px. No shrunk-to-illegible state.
4. **Text selection.** *Status: locked — globally disabled.* See §8 "Text selection." `user-select: none` site-wide; no `::selection` color because nothing is selectable.
5. **Numeric epigraphy.** *Status: locked.* Inter 900 for the figure, JetBrains Mono for the unit/label suffix (e.g. `240` Inter 900 large + `CLIENTS` mono 10.5px).
6. **Interactive focus rings.** *Status: locked — `1px` outline, `2px` offset, `ultramarine`.* Applies to any keyboard-focusable element. Outline is visible regardless of chamfered clip-path (rendered via `outline`, not `border`).

---

*This is the brand-level spec. Phase 3 — Refinement — happens when each Void project applies this specification, renders it, and validates the result emotionally. BDE completes, per product, when the rendered page produces the genuine emotional response against the stated intent.*
