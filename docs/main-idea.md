# Smash Wise — Product Bible

> **Share badminton money and sweat**
> Single source of truth for vision, design, and technical direction.

---

## 1. Vision & Philosophy

### What It Is

A shared expense tracker for a small, trusted badminton friend group (5–20 people). One question answered instantly: **"Who owes whom, and how much?"**

- A **ledger with a leaderboard** — not a payments app, not a social network, not a budgeting tool
- **Quick-glance dashboard** — open, see balances, done
- **Admin-controlled** — one person manages the group, keeps it clean
- **Mobile-first web app** — used at the court on phones, no app store needed
- **Personal/hobby project** — built for real use, not for scale

### What It Is NOT

- Not a Splitwise competitor — no marketplace, no multi-group juggling, no ads
- Not a payments app — no Venmo/PayNow/Stripe, settle up in person
- Not a social network — no feeds, comments, or reactions
- Not a budgeting tool — no category reports, no savings goals
- Not multi-tenant SaaS — one deployment, one friend group
- Not a booking/scheduling app

### Core Philosophy

1. **Speed over features** — if you can't log an expense in 60 seconds, it's broken
2. **Trust over security** — this is a friend group, not a bank. No auth in MVP.
3. **Clarity over cleverness** — show the number, skip the chart
4. **Ship over perfect** — Vercel Blob is fine for v1. Migrate later.

### Core User Loop

```
OPEN  → "I just paid for courts, let me log it"
  ↓
ACTION → Log expense, split among attendees
  ↓
REWARD → Instant balance update, everyone sees who owes what
  ↓
RETURN → Next session (1–3×/week), same loop
```

**The hook:** After every badminton session, the organizer has a natural trigger (they just paid) and a 60-second action (log the expense). The reward is immediate clarity — no more mental math or awkward messages.

---

## 2. Target Users

### Primary — "The Organizer" (Admin)

- **Who:** The friend who always books courts and collects money
- **Behavior:** Currently tracks expenses in WhatsApp or Notes app, loses track after 3 sessions
- **Wants:** A single place to log expenses and see who owes what
- **Pain:** Mental overhead of tracking, awkward "you owe me" messages
- **Usage:** Logs expenses after each session (1–3 min), checks balances weekly

### Secondary — "The Regular" (Player)

- **Who:** Friends who play regularly, want to pay their fair share
- **Behavior:** Trusts the organizer, occasionally asks "do I owe anything?"
- **Wants:** Quick way to see their balance without asking
- **Pain:** Guilt/embarrassment of not knowing their balance
- **Usage:** Opens app when reminded, checks balance (30 sec)

### Tertiary — "The Drop-in" (Occasional)

- **Who:** Friends who join sporadically
- **Wants:** Only included in expenses for sessions they attended
- **Pain:** Being charged for sessions they missed
- **Usage:** Checks app rarely

### Language Guide

| Always Use | Never Use | Why |
|-----------|----------|-----|
| Session | Game, Match | A "session" is one meetup at the court |
| Expense | Transaction, Payment | We track expenses, not payments |
| Balance | Debt, Owing | "Balance" is neutral, "debt" feels heavy |
| Settle up | Pay back, Reimburse | Casual tone — friends settling, not invoicing |
| Member | User, Player | They're group members |
| Group | Team, Organization | Friend group, not a company |
| Admin | Owner, Manager | One person runs the group |
| Split | Divide, Share | "Split the expense" is the natural phrase |
| Log | Create, Add, Record | "Log an expense" — quick and casual |

---

## 3. Core Experience

### MVP Features (Phase 1)

| Feature | Priority | Notes |
|---------|----------|-------|
| Group dashboard with member balances | P0 | Home screen — who owes whom at a glance |
| Add expense (amount, payer, split among) | P0 | Core action — must be fast and frictionless |
| Expense history list | P0 | Scrollable, most recent first, grouped by month |
| Equal split among selected members | P0 | Select who attended, split evenly |
| Admin: add/remove members | P0 | Simple member management |
| Settle up (record payment) | P0 | Mark a debt as settled without deleting history |
| Responsive mobile-first UI | P0 | Used at the court on phones |
| Dark mode, professional look | P1 | Matches design system |
| Simplified balances (minimize transactions) | P1 | "A owes B $10" instead of 5 separate debts |

### Interaction Patterns

- **Bottom tab bar** (mobile) — 3 tabs: Dashboard, History, Members
- **FAB** — persistent "+" button for logging expenses
- **Full-page navigation** — Log Expense is a full page, not a modal (enough fields to warrant it)
- **Settle quick action** — "Settle" button on balance cards pre-fills the form and navigates to `/log?mode=settle&from=X&to=Y`
- **Pull to refresh** — Dashboard only
- **No swipe gestures** — explicit buttons over hidden gestures
- **44×44px minimum** tap targets everywhere

### Feedback & Reward

- **Balance count-up animation** when expenses are logged
- **Confetti overlay** when all balances reach $0 ("All squared up!")
- **Success toast** after logging an expense
- **Skeleton loading** states for every screen
- **Empty states** with emoji + explanation + CTA

---

## 4. UI/UX Direction

### Visual Design

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background |
| Primary accent | `cyan-400/500` | Actions, selected states, FAB, positive balances |
| Secondary accent | `amber-400/500` | Attention, negative balances, outstanding totals |
| Tertiary accent | `purple-400/500` | Gradient text, brand elements, decorative |
| Success | `emerald-400/500` | Settlements, "all settled" state, success toasts |
| Danger | `red-400/500` | Destructive actions only (NOT for debt amounts) |
| Neutral | `zinc-100`–`zinc-900` | Text, borders, surfaces |
| Font | Geist Sans | Body text |
| Mono font | Geist Mono | All monetary values (alignment + clarity) |
| Effects | Subtle glows, gradient text, backdrop blur | Decorative, never distracting |
| Max width | `5xl` (1024px) | Centered with `px-4` |

### Color Semantics

- **Positive balance (is owed money):** `cyan-400`
- **Negative balance (owes money):** `amber-400` (debt ≠ danger)
- **Zero balance:** `zinc-500`
- **Settlement entries:** `emerald-400`
- Never use red for monetary amounts
- Never use purple for interactive elements (decorative only)

### Core Screens

**4 screens total:**

| # | Screen | URL | Purpose | Primary Action |
|---|--------|-----|---------|---------------|
| 1 | Dashboard | `/` | Who owes whom at a glance | Tap "Log Expense" |
| 2 | Log Expense | `/log` | Record expense or settlement | Submit |
| 3 | History | `/history` | Browse past expenses | View/filter |
| 4 | Members | `/members` | Manage group (admin) | Add/remove member |

### Dashboard Layout (Mobile)

```
┌─────────────────────────────┐
│  Smash Wise         [Admin] │
│                             │
│  ┌─────────────────────────┐│
│  │  $142.50 outstanding    ││  ← Balance summary
│  │  across 4 settlements   ││
│  └─────────────────────────┘│
│                             │
│  Simplified Balances        │
│  ┌─────────────────────────┐│
│  │ Alex → Sam      $25.00  ││  ← Balance cards
│  │ ─────────────── [Settle]││
│  ├─────────────────────────┤│
│  │ Jordan → You    $18.50  ││
│  │ ─────────────── [Settle]││
│  └─────────────────────────┘│
│                             │
│  Recent Activity            │
│  ┌─────────────────────────┐│
│  │ 🏸 Court booking  $40   ││  ← Last 3 expenses
│  │ Paid by Alex · 4 people ││
│  └─────────────────────────┘│
│  View all →                 │
│                             │
│         [ ＋ Log Expense ]  │  ← FAB
│  [Dashboard] [History] [Members] │
└─────────────────────────────┘
```

### Log Expense Layout (Mobile)

```
┌─────────────────────────────┐
│  ← Back       Log Expense   │
│                             │
│  ┌─[Expense]──[Settle Up]─┐│  ← Mode toggle
│  └─────────────────────────┘│
│                             │
│  Amount                     │
│  ┌─────────────────────────┐│
│  │  $  [ 40.00           ] ││  ← Auto-focus, large input
│  └─────────────────────────┘│
│                             │
│  Description (optional)     │
│  ┌─────────────────────────┐│
│  │  [ Court booking       ] ││
│  └─────────────────────────┘│
│                             │
│  Paid by                    │
│  ┌────┐ ┌────┐ ┌────┐     │  ← Horizontal scroll, single-select
│  │Alex│ │ Sam│ │ You│ ...  │
│  │ ✓  │ │    │ │    │     │
│  └────┘ └────┘ └────┘     │
│                             │
│  Split among                │
│  ┌────┐ ┌────┐ ┌────┐     │  ← Multi-select + "Select All"
│  │Alex│ │ Sam│ │ You│ ...  │
│  │ ✓  │ │ ✓  │ │ ✓  │     │
│  └────┘ └────┘ └────┘     │
│  4 of 8 selected            │
│                             │
│  Split: $10.00 each         │  ← Live calculation
│                             │
│  ┌─────────────────────────┐│
│  │    Submit Expense        ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

### State → UI Mapping

| State | UI Treatment |
|-------|-------------|
| Fresh group (no expenses) | Empty state: emoji + "Log your first expense!" CTA |
| All settled ($0 outstanding) | Celebration: confetti + "All squared up!" |
| Active balances | Default: balance cards with settle buttons |
| No members | Redirect to `/members` with "Add your group first" |
| Loading | Skeleton cards (shimmer rectangles) |
| Error | Inline error banner with retry button |

### Component Inventory (~20 components)

**Layout:** `AppShell`, `BottomNav`, `TopNav`, `PageHeader`, `FAB`
**Data display:** `BalanceSummaryCard`, `BalanceRow`, `ExpenseCard`, `SettlementCard`, `MemberPill`, `MemberRow`, `MonthHeader`, `EmptyState`
**Inputs:** `AmountInput`, `TextInput`, `MemberSelector`, `SegmentedControl`, `FilterChips`
**Feedback:** `Toast`, `SkeletonCard`, `ConfettiOverlay`, `Button`

### UX Rules

1. **60-second rule** — expense logging must complete in under 60 seconds from app open
2. **Balances are the home screen** — the answer to "do I owe anything?" visible in 1 second
3. **No dead ends** — every empty/error state has a clear next action
4. **Numbers are the UI** — dollar amounts are largest, boldest text. Use `font-mono`.
5. **Feedback is immediate** — every action produces visible feedback within 200ms
6. **One primary action per screen** — don't compete for attention
7. **Admin and member see the same screens** — show/hide controls based on role
8. **Celebrate zero** — confetti when all balances are settled

### Animation Strategy

| Animation | Trigger | Spec |
|-----------|---------|------|
| Page transition | Route change | Fade + slide up, `0.3s` |
| Balance count-up | Expense logged | Old → new value, `0.6s` |
| List stagger | Data load | Sequential fade-in, `staggerChildren: 0.05s` |
| FAB press | Tap | `whileTap: { scale: 0.9 }`, spring |
| Toast enter/exit | Show/dismiss | Slide from top + fade, auto-dismiss 3s |
| Confetti | All balances = $0 | Particle burst, `2s`, once |
| Member pill select | Tap | `scale: [1, 1.1, 1]`, `0.2s` |

**Not animated:** form inputs, tab switching, scroll, error states, icons.

### Responsive Strategy

| Range | Layout |
|-------|--------|
| <640px (mobile) | Single column, bottom nav + FAB, compact spacing |
| 640–1023px (tablet) | Wider cards, more padding, bottom nav stays |
| ≥1024px (desktop) | Top nav replaces bottom tabs, two-column dashboard, FAB → inline button |

---

## 5. Technical Architecture

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Node.js (pnpm) | Standard |
| Framework | Next.js 16 (App Router) | Server Components, Server Actions, Vercel deploy |
| UI | React 19 | Server Components by default |
| Styling | Tailwind CSS 4 | Utility-first, dark mode, responsive |
| Animation | Framer Motion (`motion`) | Layout animations, page transitions |
| Language | TypeScript (strict) | Type safety |
| Validation | Zod | Schema validation at boundaries |
| Storage (MVP) | Vercel Blob (JSON) | Zero setup, deploy and go |
| Storage (Phase 2) | SQLite via Prisma | Relational queries, migration path to Postgres |
| Deploy | Vercel | Free tier, instant deploys |

### Data Models

All monetary values stored as **integers in cents** (`$10.50` = `1050`).

```ts
interface Member {
  id: string;          // "m_" + nanoid(12)
  name: string;
  active: boolean;     // false = soft-deleted
  createdAt: string;   // ISO 8601 UTC
}

interface Expense {
  id: string;          // "e_" + nanoid(12)
  description: string;
  amount: number;      // cents
  paidBy: string;      // member ID
  splitAmong: string[];// member IDs
  createdAt: string;
}

interface Settlement {
  id: string;          // "s_" + nanoid(12)
  fromId: string;      // debtor
  toId: string;        // creditor
  amount: number;      // cents
  createdAt: string;
}

interface GroupState {
  version: 1;
  name: string;        // "Badminton Crew"
  currency: string;    // "SGD"
  members: Member[];
  expenses: Expense[];
  settlements: Settlement[];
  updatedAt: string;
}
```

### Storage Strategy (MVP)

**Single Vercel Blob JSON file** at `smash-wise/group-state.json`.

- At MVP scale (5–20 members, ~100 expenses/year): **<50 KB**
- Read entire state → mutate → write back
- `cache: 'no-store'` on reads → always fresh
- Last-write-wins concurrency (acceptable for a friend group)
- JSON structure maps 1:1 to Prisma tables for Phase 2 migration

### Server Actions (Mutations)

No API routes in MVP. Server Actions handle all mutations:

| Action | Input | Validation |
|--------|-------|------------|
| `addMember` | `{ name }` | Non-empty, ≤50 chars, no duplicate active names |
| `removeMember` | `{ memberId }` | Member exists, is active → soft-delete |
| `addExpense` | `{ description, amount, paidBy, splitAmong[] }` | Amount > 0, payer active, all split members active |
| `deleteExpense` | `{ expenseId }` | Expense exists |
| `settleUp` | `{ fromId, toId, amount }` | Amount > 0, both active, fromId ≠ toId |

All return `ActionResult = { success: true } | { success: false; error: string }`.

Pattern: validate (Zod) → read blob → business rules → mutate → write blob → `revalidatePath('/')`.

### State Management

No client-side state library. Data flows:

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│ Vercel Blob  │◄────►│ Server       │─────►│ Server      │
│ (JSON file)  │      │ Actions      │      │ Components  │
└─────────────┘      │ (mutations)  │      │ (reads)     │
                     └──────────────┘      └──────┬──────┘
                           ▲                       │ props
                           │ form submit           ▼
                     ┌─────────────────────────────────┐
                     │      Client Components          │
                     │  (forms, selectors, nav)         │
                     └─────────────────────────────────┘
```

- **Server Components:** Dashboard, balance cards, expense history, member list
- **Client Components:** Forms, member selector, amount input, bottom nav (`usePathname`)
- **URL state:** Search params for pre-filling forms (`/log?payer=m_abc&members=m_abc,m_def`)

### Balance Calculation Algorithm

Two-step:

1. **Net balances** — for each member, sum (credits from expenses paid) − (debits from expense shares) + (settlements received) − (settlements sent). Rounding: `Math.floor` per share, distribute remainder 1 cent at a time.

2. **Debt simplification** — greedy algorithm matching largest debtor ↔ largest creditor until all resolved. Minimizes number of transactions.

Complexity: $O(E \times M + N \log N)$ where $E$ = expenses, $M$ = avg members/expense, $N$ = members. For 20 members, 500 expenses: **<1ms**.

### Project Structure

```
app/
  globals.css              # Tailwind imports + theme
  layout.tsx               # Root: fonts, dark bg, nav
  page.tsx                 # Dashboard
  loading.tsx              # Dashboard skeleton
  log/
    page.tsx               # Log expense
  history/
    page.tsx               # Expense history
  members/
    page.tsx               # Member management

components/
  nav.tsx                  # Bottom tab bar (client)
  balance-list.tsx         # Simplified balances
  balance-card.tsx         # Single "A → B: $X" row
  expense-card.tsx         # Expense in history
  settlement-card.tsx      # Settlement in history
  month-group.tsx          # Month header divider
  member-avatar.tsx        # Circle with initial
  empty-state.tsx          # Empty state placeholder
  expense-form.tsx         # Log expense form (client)
  settle-form.tsx          # Settle up form (client)
  member-form.tsx          # Add member form (client)
  member-selector.tsx      # Multi-select pills (client)
  amount-input.tsx         # Currency input (client)
  submit-button.tsx        # Submit with pending state (client)

lib/
  types.ts                 # TypeScript interfaces
  schemas.ts               # Zod schemas
  blob.ts                  # Vercel Blob read/write
  balance.ts               # Balance calculation
  format.ts                # formatCurrency(), formatDate()
  ids.ts                   # nanoid wrappers
  constants.ts             # DEFAULT_STATE, currency config
  actions/
    members.ts             # addMember, removeMember
    expenses.ts            # addExpense, deleteExpense
    settlements.ts         # settleUp
```

### Key Technical Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| IDs | `nanoid(12)` with type prefix (`m_`, `e_`, `s_`) | Small, URL-safe, debuggable |
| Currency | Integers in cents | No floating-point bugs, industry standard |
| Dates | ISO 8601 UTC strings (JSON) / `DateTime` (Prisma) | Display with `Intl.DateTimeFormat` |
| Optimistic UI | Not in MVP | Writes too infrequent to justify complexity |
| Error handling | Zod → `ActionResult` → `error.tsx` (3 layers) | Validation, business, infrastructure |
| Member deletion | Soft delete (`active: false`) | Preserve expense history |
| Form prefill | URL search params | Shareable, zero client JS |

### Prisma Schema (Phase 2 Preview)

```prisma
model Member {
  id        String   @id @default(cuid())
  name      String
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  expensesPaid    Expense[]      @relation("PaidBy")
  expenseSplits   ExpenseSplit[]
  settlementsFrom Settlement[]   @relation("SettlementFrom")
  settlementsTo   Settlement[]   @relation("SettlementTo")
}

model Expense {
  id          String   @id @default(cuid())
  description String
  amount      Int
  paidById    String
  paidBy      Member   @relation("PaidBy", fields: [paidById], references: [id])
  createdAt   DateTime @default(now())
  splits      ExpenseSplit[]
}

model ExpenseSplit {
  id        String  @id @default(cuid())
  expenseId String
  expense   Expense @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  memberId  String
  member    Member  @relation(fields: [memberId], references: [id])
  amount    Int
  @@unique([expenseId, memberId])
}

model Settlement {
  id        String   @id @default(cuid())
  fromId    String
  from      Member   @relation("SettlementFrom", fields: [fromId], references: [id])
  toId      String
  to        Member   @relation("SettlementTo", fields: [toId], references: [id])
  amount    Int
  createdAt DateTime @default(now())
}
```

---

## 6. Product Phases

### Phase 1: MVP — "Replace the WhatsApp Ledger"

**Goal:** A working app the group actually uses after their next session.

**Scope:** Dashboard + log expenses + equal split + settle up + member management. Vercel Blob storage. No auth. Dark mode, mobile-first.

**Success gate:**
| Metric | Target |
|--------|--------|
| Group adoption | 100% of members opened app |
| Weekly logging | >90% of sessions have expenses logged |
| Time to log | <60 seconds |
| "Go back to WhatsApp?" | "No" from everyone |

### Phase 2: "Lock It Down" — Auth & Persistence

**Goal:** Real user accounts, proper database, permission controls.

**Scope:**
- User authentication (NextAuth/Clerk)
- Role-based permissions (admin/member)
- Database migration (Blob → SQLite/Prisma)
- Edit/delete expense (admin only)
- Expense categories (court, shuttle, food, other)
- Unequal/custom splits
- Activity log

**Success gate:** Zero data loss. Auth doesn't slow down expense logging.

### Phase 3: "Quality of Life" — Polish & Convenience

**Goal:** Small touches that make the group say "this is better than Splitwise."

**Scope:**
- Push/email notifications
- Monthly summary stats
- Export to CSV
- Multiple groups (if other friend groups want in)
- Recurring expense templates
- Fun stats ("most generous payer", "biggest spender")

**Success gate:** Group engagement stays high. Features used, not ignored.

---

## 7. Anti-Goals & Scope Boundaries

### Anti-Goals

- **No payment integration** — settle in person. Adding payments adds compliance and trust issues.
- **No multi-tenancy** — one deploy = one group. Others can fork it.
- **No complex splitting** — equal split or custom amounts. No percentages, no itemized bills, no receipt scanning.
- **No social features** — no comments, reactions, chat, or activity feeds.
- **No offline support** — not worth the complexity. You're at a court, not a cave.
- **No i18n / multi-currency** — one language, one currency.
- **No native app** — web app is sufficient. PWA at most.

### Scope Boundaries

- **Max group size:** 5–20 people. Won't optimize for 100+.
- **Data retention:** Keep everything forever (tiny dataset).
- **Admin model:** Single admin. No co-admin, no democracy.
- **Design effort:** Professional but not pixel-perfect. Tailwind defaults > custom system.

---

## 8. North Star Metric

**Expenses logged per week** — if expenses are being logged, the app is doing its job.

| Metric | Definition | MVP Target |
|--------|-----------|------------|
| Adoption | All group members opened the app | 100% |
| Weekly logging | ≥1 expense per session | >90% of sessions |
| Balance checks | Members who check balance weekly | >50% |
| Time to log | Open app → expense submitted | <60 seconds |
| Satisfaction | "Would you go back to WhatsApp?" | "No" from everyone |

---

## 9. Implementation Progress

### Completed (Phase 1 MVP)

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard with member balances | ✅ Done | Balance summary, simplified debts, recent activity |
| Add expense (amount, payer, split) | ✅ Done | Full form with mode toggle (expense/settle) |
| Expense history list | ✅ Done | Grouped by month, merged expenses + settlements |
| Equal split among selected members | ✅ Done | Live per-person calculation |
| Admin: add/remove members | ✅ Done | Soft delete, balance display per member |
| Settle up (record payment) | ✅ Done | Pre-fill from balance card "Settle" button |
| Responsive mobile-first UI | ✅ Done | Bottom nav + FAB on mobile, top nav on desktop |
| Dark mode, professional look | ✅ Done | `#0a0a0a` background, cyan/amber/purple accents |
| Simplified balances | ✅ Done | Greedy debt simplification algorithm |
| Framer Motion animations | ✅ Done | Staggered list items, FAB spring, member pill tap |
| Delete expense | ✅ Done | Confirm-then-delete UI in history view |
| Error boundaries | ✅ Done | `error.tsx` for all routes with retry button |
| Loading skeletons | ✅ Done | `loading.tsx` for all routes (shimmer rectangles) |
| Toast notifications | ✅ Done | Success/error toasts with auto-dismiss (3s) |
| Confetti celebration | ✅ Done | Particle burst when all balances = $0 |
| Database (Prisma/PostgreSQL) | ✅ Done | Full schema with relations and indexes |

### Remaining (Phase 1 Polish)

| Feature | Status | Notes |
|---------|--------|-------|
| Pull to refresh (dashboard) | ✅ Done | Touch gesture on mobile, triggers router.refresh() |
| Expense categories | ✅ Done | Court, shuttle, food, other — stored in DB, shown in form + cards |
| Filter/search in history | ✅ Done | Category chips + text search, client-side filtering |

### Tech Stack Deviation from Original Plan

- **Storage:** Skipped Vercel Blob, went directly to Prisma/PostgreSQL
- **IDs:** Using Prisma `cuid()` instead of `nanoid(12)` with prefixes

---

*Last updated: 2026-04-22*
