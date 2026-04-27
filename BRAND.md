# PARKED. — Brand Guidelines

> "Not abandoned, just parked."
> 
PARKED. is an mobile app where users can  “park” their ideas and hobbies in a simple and judgement-free way. Instead of letting it clutter their brain or do-to list, users can organise and pause things they mean to come back to. Not abandoned, just parked. 

This document defines how PARKED. should look, sound, and feel across every
surface: product UI, microcopy, notifications, and future marketing.

---

## 1. Brand foundation

### Mission
Give people a quiet, pressure-free place to keep the ideas and hobbies that
matter to them — so nothing has to be "finished or forgotten."

### Brand values
- **Permission to pause.** Slowing down is not failing.
- **Kindness over urgency.** We never push, nag, or rank.
- **Memory you can trust.** What you park is safe, and easy to come back to.
- **Clarity without coldness.** Plain language, warm tone.
- **Privacy by default.** Items live on the device; nothing is shipped off
  without consent.

### Brand personality
1. **Calm** — quiet typography, generous whitespace, slow transitions.
2. **Supportive** — talks to the user like a trusted friend, never a coach.
3. **Non-judgmental** — no streaks, no scoring, no "you haven't done this in…"
4. **Considered** — thoughtful defaults, fewer options surfaced at once.
5. **Quietly playful** — small warmth (a soft yellow, a gentle quote) without
   becoming twee.

### Emotional tone
Users should feel **relieved**, **understood**, and **a little lighter** after
using PARKED. The emotional contract is the opposite of a productivity app:
opening PARKED. should lower their shoulders, not raise their pulse.

---

## 2. Tone of voice

### Writing style
- Plain, lowercase-friendly sentences. Short over clever.
- Reassuring; never instructive or scolding.
- First-person plural is rare ("we"). Address the user directly ("you").
- Avoid productivity vocabulary: *goal, deadline, progress, streak, behind*.
- Use soft verbs: *park, keep, hold, set down, come back to*.

### DO / DON'T

| Do say | Don't say |
|---|---|
| "Park it" | "Save task" |
| "Come back to it whenever" | "Don't forget!" |
| "Snooze 2 weeks" | "Reschedule deadline" |
| "Recently deleted" | "Trash" / "Bin" (in body copy) |
| "You'll have 7 days to restore this." | "This action is permanent." |
| "Nothing parked yet — that's okay." | "No items found." |
| "Not abandoned, just parked." | "Procrastination station." |

### Microcopy library

**Buttons**
- Primary: `Park it`, `Unpark`, `Park again`, `Restore`
- Secondary: `Snooze 2 weeks`, `Edit`, `Cancel`
- Destructive: `Delete`, `Delete forever`

**Empty states**
- Parking lot: *"Nothing parked yet. When an idea visits, give it a calm spot
  to rest."*
- Active: *"Nothing's been unparked yet. When you're ready to pick something
  back up, it'll show up here."*
- Recently deleted: *"Empty. Deleted items wait here for 7 days, just in
  case."*

**Confirmations**
- Delete: *"Are you sure you want to delete? You'll have 7 days to restore
  this before it gets deleted for good."*
- Sign out: *"Sign out? Your parked items stay safe on this device."*

**Notifications (future)**
- *"Your watercolor set has been parked for a while — no rush, just here when
  you're ready."*
- Avoid: ❌ *"You're falling behind!"* / ❌ *"Don't lose your streak!"*

---

## 3. Visual identity

### Logo / wordmark
- The wordmark is set in **Georgia Bold**, all caps, with a trailing period:
  `PARKED.`
- The period is part of the mark — it grounds the word and signals "settled,
  set down."
- Minimum clear space around the mark equals the cap-height of the "P".

### Color system

All colors used in product. Hex values are the source of truth — see
`constants/colors.ts`.

#### Foundation
| Token | Hex | Use |
|---|---|---|
| Background | `#F5F5F5` | App canvas; warm off-white |
| Card | `#FFFFFF` | Item cards, surfaces |
| Border | `#E8E4DA` | Hairline dividers, chip outlines |
| Divider | `#EFEAE0` | Section dividers, subtle wells |
| Text primary | `#1C1C1A` | Headings, body, primary buttons |
| Text secondary | `#554C37` | Meta, labels, captions |
| Accent / muted surface | `#EAE6DB` | Quote card, neutral chip fill |

#### Type colors (item type chips)
| Type | Hex |
|---|---|
| Idea | `#9CC9DD` (soft sky blue) |
| Hobby | `#D7E8B5` (soft sage) |

#### Category palette
Used as soft fills behind category chips. Custom categories the user creates
get a color auto-assigned from a 12-step extended palette to avoid repeats.

| Category | Hex |
|---|---|
| Creative | `#E9AECE` |
| Business | `#9DD3C4` |
| Personal | `#9CC9DD` |
| Reading | `#AECC57` |
| Sports | `#D58F77` |
| Cooking | `#F1C27D` |

#### Energy levels
| Level | Hex | Meaning |
|---|---|---|
| Low | `#85CB7D` | A calm, easy return |
| Medium | `#E9F876` | Some focus required |
| High | `#E7645F` | Bigger lift; needs space |

#### Status
| Token | Hex | Use |
|---|---|---|
| Warning | `#EBF527` | Past-due check-in badge |
| Snooze surface | `#F9FF83` | Check-in row default; softer than warning |
| Success | `#85CB7D` | Restored / saved confirmations |
| Destructive | `#C0524A` | Delete button fill |

#### Color rules
- Yellow is reserved for **time** (check-ins, snooze, due). Don't use it for
  primary actions.
- Red (`#C0524A`) only appears on **Delete**. Never as a warning or accent.
- Category and type colors are **soft tints** — never used as text color or
  for full-bleed surfaces.

### Typography

PARKED. uses three families, each with a clear job:

| Family | Role | Where |
|---|---|---|
| **Georgia / Georgia Bold** (serif) | Display & headings | Wordmark, page titles, item titles, pull-quotes |
| **DM Sans** (sans, weights 400/500/600/700) | UI & body | Buttons, body text, chips, menu rows |
| **DM Mono** (mono, weights 400/500) | Meta & marker | Labels, dates, counts, captions, "uppercase tag" feel |

#### Hierarchy

| Style | Family / Weight | Size / Line | Use |
|---|---|---|---|
| Display | Georgia Bold | 30 / 36 | Item title, screen heroes |
| Title | Georgia Bold | 22 | Card titles, modal headings |
| Body | DM Sans 400 | 15 / 22 | Paragraphs, notes |
| Body strong | DM Sans 600 | 15 | Inline emphasis, button labels |
| Label (uppercase) | DM Sans 500 | 12, letter-spacing 0.6 | Section labels |
| Meta | DM Mono 400 | 12–13 | Dates, counts, secondary detail |
| Quote | Georgia Italic | 18 | Brand voice moments |

#### Rules
- One serif heading per screen; never stack two large serifs.
- Mono is for meta only — never for body or buttons.
- Avoid uppercase paragraphs; uppercase is for short labels (≤ 4 words).

---

## 4. UI style guidelines

### Layout & spacing
- **Base unit:** 4px. Common steps: 4 / 8 / 12 / 16 / 20 / 24.
- **Screen padding:** 20px horizontal, generous top breathing room.
- **Vertical rhythm:** 18–24px between major blocks.
- **Touch targets:** minimum 44×44.
- Prefer one column; never crowd. Whitespace is part of the brand.

### Cards
- Background `#FFFFFF`, border `#E8E4DA`, radius `16` (small) / `18` (large).
- No drop shadows. PARKED. is a **flat, paper-like** surface.
- Inner padding 14–18.
- Card titles use Georgia Bold; body uses DM Sans.

### Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `#1C1C1A` | white | none | Park it, Unpark, Park again |
| Secondary | white | `#1C1C1A` | `#E8E4DA` 1px | Cancel, Edit |
| Outline | white | `#1C1C1A` | `#000000` 0.5px | Snooze 2 weeks |
| Destructive | `#C0524A` | white | none | Delete |
| Warning (fill) | `#EBF527` | `#1C1C1A` | none | Reserved for due/snooze accents |
| Ghost | transparent | `#1C1C1A` | none | Inline links |

- Radius `14`, min height `50` (`58` at `lg` size).
- Pressed state: `opacity 0.85`. Disabled: `opacity 0.55`.
- Always pair primary actions with a clear cancel.

### Form elements
- Inputs: white fill, `#E8E4DA` 1px border, radius 14, `12px` vertical padding.
- Labels: DM Sans 500, uppercase, `#554C37`, sized 12.
- Multi-select chips (`SelectChips`): pill-shaped (radius 999), 1px border;
  selected = filled with the option's tint, deselected = white + neutral
  border.
- The "+ Add new category" affordance is a dashed-border chip that swaps to
  an inline text input + check / cancel buttons. Keep this pattern for any
  "create from inline" flow.

### Icons
- Library: **Feather Icons** (1.5px stroke, rounded caps).
- Always outlined; never filled.
- Common sizes: 14 (inline meta), 16 (chip / button), 18 (menu row), 20
  (top-bar action).
- Round icon buttons sit in a 36×36 white well with `#E8E4DA` border.

### Motion
- Default transition: 180–240ms ease-out.
- Prefer fade + small translate over bouncy springs.
- Haptics: **selection-light** on tap of meaningful actions (park, unpark,
  add category). Never use heavy or notification haptics.

---

## 5. Component behaviour

PARKED. items move between three lifecycle states. The visual treatment is
intentionally **soft** for all of them — even "deleted" should feel reversible.

### Parked (default)
- Card: white, hairline border, full opacity.
- Type chip and category chip use their tint colors.
- Energy dot uses the energy color.
- Check-in row: soft yellow (`#F9FF83`) background. If past-due, the row
  switches to `#EBF527` and gains the calendar icon emphasis.
- Actions visible: **Unpark**, **Snooze 2 weeks** (if a check-in is set),
  **Delete**.

### Active (unparked)
- Lives on the **Active items** page, opened from the play-circle in the
  dashboard header (with a count badge) or from Account → Active items.
- Card carries a small "Active" badge; chips and typography stay the same so
  items remain recognizable.
- Primary action becomes **Park again**, which opens a calm pre-filled
  editor (notes, category, energy, check-in) so the user can update the item
  before it returns to the lot.
- Three example active items are seeded on first run so the page never feels
  empty.

### Deleted (recently deleted)
- Lives on the **Recently deleted** page, opened from the trash icon in the
  dashboard header (with count badge) or from Account → Recently deleted.
- Items show a quiet **"X days left"** countdown and two actions:
  **Restore** (returns to the parking lot, clearing the deletion mark) and
  **Delete forever** (immediate, with a confirm).
- After 7 days items are auto-purged on app open. The user is never told
  "you missed it" — they just stop seeing it.
- The detail screen shows a small notice instead of action buttons:
  *"In Recently deleted — you can restore it from there."*

### State color summary

| State | Card | Accent |
|---|---|---|
| Parked | white | tint chip + soft yellow check-in |
| Active | white + subtle "Active" badge | unchanged tints |
| Deleted | white, slightly muted meta | warm amber countdown text |

### Interaction rules
- Confirm any destructive or undoable action with a calm, two-line dialog
  (heading + reassurance).
- Always offer a non-destructive default (`Cancel`, `Keep parked`).
- Never block the user with modal toasts. Use inline status when possible.
- Soft delete first, hard delete second — there is no instant permanent
  delete from the parking lot.

---

## 6. Brand experience

### How the app should feel
- **Calm.** Long pages of breathing room over dense feeds.
- **Safe.** What you park is yours, on this device, and recoverable.
- **Low-pressure.** No streaks, no leaderboards, no "you've parked this for
  314 days" guilt counters.
- **Considered.** Each screen does one thing well.

### What to avoid
- Urgency cues: countdown timers (outside the 7-day grace window),
  notification badges that imply work waiting, exclamation marks.
- Productivity language: "tasks," "to-do," "deadline," "completion rate."
- Gamification: streaks, points, ranks, achievements.
- Aggressive color: saturated reds outside of `#C0524A` Delete; never
  red text.
- Guilt copy: "still haven't…", "again?", "are you really going to…".

### UX tone guidelines
- Alerts use **questions, not commands** ("Park this back?" not "Confirm
  parking.").
- Errors are reframed as small redirections, not failures ("Hm — that
  category already exists.").
- Empty states acknowledge the moment ("Nothing parked yet — that's okay.").
- Notifications (future) should arrive **at most weekly**, opt-in, and
  framed as a soft reminder, not a nudge.

---

## 7. Usage examples

### Dashboard (Parking lot)
- Top bar: round icon buttons for **Active** (play-circle), **Recently
  deleted** (trash-2), **Account** (user). Each shows a count badge when
  non-zero.
- Page title in Georgia Bold; subtitle in Georgia italic ("Not abandoned,
  just parked.").
- Filter row: type and category chips (DM Sans 500).
- Item list: white cards, type + category pills, energy dot, "parked X days
  ago" in DM Mono.

### Item card
```
┌──────────────────────────────────────────┐
│  [Idea blue chip]  [Reading green chip]  │
│                                          │
│  Watercolor weekends           ●         │
│  Georgia Bold 18                Low      │
│                                          │
│  notes preview in DM Sans 14, two        │
│  lines max, soft secondary color…        │
│                                          │
│  parked 14 days ago        Check-in: Jul │
│  DM Mono 12                  DM Mono 12  │
└──────────────────────────────────────────┘
```

### Buttons (item detail)

| Order | Label | Style |
|---|---|---|
| 1 | **Unpark** / **Park again** | Primary, large |
| 2 | Snooze 2 weeks | White + thin black border, 0.5px |
| 3 | Delete | Filled `#C0524A`, white text |

Stack vertically with 10px gap. Snooze only appears when a check-in date
exists.

### Confirmation dialog (Delete)
```
Title:    Are you sure you want to delete?
Body:     You'll have 7 days to restore this
          before it gets deleted for good.
Buttons:  [ Cancel ]   [ Delete ]    ← destructive
```

### Quote card (Account screen)
- Background `#EAE6DB`, radius 18.
- Wordmark, italic Georgia quote, DM Mono body.
- Used sparingly — one calm "moment of brand" per surface.

---

## Quick reference

**Three numbers to remember**
- `#1C1C1A` — primary ink
- `#F5F5F5` — page canvas
- `#9CC9DD` — Idea blue (most-seen accent)

**Three families**
- Georgia (serif) for warmth and weight
- DM Sans for clarity
- DM Mono for meta

**Three feelings**
- Calm. Safe. Permission to pause.
