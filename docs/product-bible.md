# Smash Wise — Product Bible

> **Share badminton money and sweat**
> Personal expense-splitting app for a badminton friend group.

---

## 1. Core Value Proposition

**The job:** After every badminton session, someone pays for courts, shuttlecocks, drinks, or food — and nobody remembers who owes what. Smash Wise answers one question instantly: **"Who owes whom, and how much?"**

This is a **ledger with a leaderboard** — not a payments app, not a social network, not a budgeting tool. You log expenses, the app does the math, everyone sees the balance. Done.

---

## 2. What Smash Wise IS

- A **shared expense tracker** for a small, trusted friend group
- A **quick-glance dashboard** — open it, see balances, move on
- A **simple ledger** — expenses in, balances out
- **Admin-controlled** — one person manages the group, keeps it clean
- **Mobile-first web app** — works on phones at the court, no app store needed
- A **personal/hobby project** — built for real use, not for scale

## What Smash Wise is NOT

- ❌ Not a Splitwise competitor — no marketplace, no multi-group juggling, no ads
- ❌ Not a payments app — no Venmo/PayNow integration, settle up in person
- ❌ Not a social network — no feeds, no comments, no reactions
- ❌ Not a budgeting tool — no categories, no monthly reports, no savings goals
- ❌ Not multi-tenant SaaS — one deployment, one friend group (for now)
- ❌ Not a booking app — doesn't manage court reservations or scheduling

---

## 3. Target Personas

### 🏸 The Admin — "The Organizer"
- **Who:** The friend who always books courts and collects money (that's you)
- **Behavior:** Currently tracks expenses in a WhatsApp group or Notes app, gets confused after 3 sessions
- **Wants:** A single place to log expenses and see who owes what, without chasing people
- **Pain:** Mental overhead of remembering who paid, awkward "you owe me" messages
- **Usage:** Logs expenses after each session (1-3 min), checks balances weekly

### 🏸 The Player — "The Regular"
- **Who:** Friends who show up to play, want to pay their fair share
- **Behavior:** Trusts the organizer to track things, occasionally asks "do I owe anything?"
- **Wants:** A quick way to see their balance without asking anyone
- **Pain:** Guilt of not knowing if they owe, embarrassment of asking
- **Usage:** Opens app after being reminded, checks balance (30 sec), settles up in person

### 🏸 The Occasional — "The Drop-in"
- **Who:** Friends who join once in a while
- **Behavior:** Shows up sporadically, doesn't want to be part of every expense
- **Wants:** Only be included in expenses from sessions they attended
- **Pain:** Being charged for sessions they missed
- **Usage:** Checks app rarely, only when tagged in an expense

---

## 4. Core User Loop

```
OPEN → "I just paid for courts, let me log it"
  ↓
ACTION → Log expense, split among attendees
  ↓
REWARD → Instant balance update, everyone sees who owes what
  ↓
RETURN → Next session, same loop — or check balance when settling up
```

**The hook:** After every badminton session, the organizer has a natural trigger (they just paid) and a 60-second action (log the expense). The reward is immediate clarity — no more mental math or awkward messages.

**Return trigger:** The next session (typically 1-3x per week for an active group).

---

## 5. Success Criteria & North Star

### North Star Metric
**Expenses logged per week** — if expenses are being logged, the app is doing its job. Everything else follows.

### Success Criteria (MVP)

| Metric | Definition | Target |
|--------|-----------|--------|
| Adoption | All group members have opened the app | 100% of group |
| Weekly active logging | At least 1 expense logged per session | > 90% of sessions |
| Balance check rate | % of members who check balance weekly | > 50% |
| Time to log | Time from opening app to expense submitted | < 60 seconds |
| "Would you go back to WhatsApp?" | Qualitative — ask the group | "No" from everyone |

> **Note:** This is a friend group app. The real success metric is: **does the group actually use it instead of WhatsApp/mental math?**

---

## 6. Product Phases

### Phase 1: MVP — "Replace the WhatsApp Ledger"
**Goal:** A working app the group actually uses after their next session.
**Tech:** Next.js, Vercel Blob (JSON storage), deploy to Vercel. No auth — admin-managed.

| Feature | Priority | Notes |
|---------|----------|-------|
| Group dashboard with member balances | P0 | The home screen — who owes whom at a glance |
| Add expense (amount, payer, split among) | P0 | Core action — must be fast and frictionless |
| Expense history list | P0 | Scrollable list of all expenses, most recent first |
| Equal split among selected members | P0 | Select who attended, split evenly |
| Admin: add/remove members | P0 | Simple member management |
| Settle up (record payment) | P0 | Mark a debt as settled without deleting history |
| Responsive mobile-first UI | P0 | Used at the court on phones |
| Dark mode, professional look | P1 | Matches the design system — looks legit |
| Simplified balances (minimize transactions) | P1 | "A owes B $10" instead of 5 separate debts |

**Not in MVP:** Auth, multiple groups, custom splits, categories, notifications, export.

---

### Phase 2: "Lock It Down" — Auth & Persistence
**Goal:** Real user accounts, proper database, permission controls.
**Tech:** Add NextAuth/Clerk, migrate from Vercel Blob to SQLite/Prisma (→ future Postgres).

| Feature | Priority | Notes |
|---------|----------|-------|
| User authentication (login/signup) | P0 | Simple — email/password or social login |
| Role-based permissions (admin/member) | P0 | Admin creates group, grants expense-logging rights |
| Database migration (Blob → SQLite/Prisma) | P0 | Proper relational data |
| Edit/delete expense (admin only) | P1 | Fix mistakes without starting over |
| Expense categories (court, shuttle, food, other) | P1 | Light categorization — 4 preset categories, no custom |
| Unequal splits (custom amounts) | P1 | "I had the expensive drink" scenario |
| Activity log | P2 | Who added/edited what — accountability |

---

### Phase 3: "Quality of Life" — Polish & Convenience
**Goal:** Make it delightful. Small touches that make the group say "this is better than Splitwise."
**Tech:** Same stack, add nice-to-haves.

| Feature | Priority | Notes |
|---------|----------|-------|
| Push/email notifications ("new expense added") | P1 | Nudge players to check balances |
| Monthly summary ("this month you spent $X") | P1 | Fun insight, not budgeting |
| Export to CSV | P2 | For the one friend who wants a spreadsheet |
| Multiple groups | P2 | If other friend groups want in |
| Recurring expenses (weekly court booking) | P2 | Auto-create expense templates |
| Fun stats ("most generous payer", "biggest spender") | P2 | Gamification-lite — bragging rights |

---

## 7. Anti-Goals & Scope Boundaries

### Anti-Goals (things we will actively avoid)
- **Payment integration** — no Venmo, PayNow, Stripe. Settle in person. Adding payments adds complexity, compliance, and trust issues.
- **Multi-tenancy** — this is one deployment for one group. If others want it, they fork it.
- **Complex splitting algorithms** — no percentage splits, no itemized bills, no receipt scanning. Equal split or custom amounts, that's it.
- **Social features** — no comments, reactions, chat, or activity feeds. This is a tool, not a hangout.
- **Offline support** — not worth the complexity for a hobby project. Need internet? You're at a badminton court, not a cave.
- **i18n / multi-currency** — one language, one currency. The friend group speaks one language and plays in one country.
- **Native mobile app** — PWA at most. Web app is sufficient.

### Scope Boundaries
- **Max group size:** Designed for 5-20 people. Won't optimize for 100+.
- **Data retention:** Keep everything forever (it's a small dataset). No archiving logic.
- **Admin model:** Single admin per group. No co-admin, no democracy. The organizer runs the show.
- **Design effort:** Professional but not pixel-perfect. Tailwind + good defaults > custom design system.

---

## 8. Language Guide

| Always Use | Never Use | Why |
|-----------|----------|-----|
| Session | Game, Match | A "session" is one meetup at the court |
| Expense | Transaction, Payment | We track expenses, not payments |
| Balance | Debt, Owing | "Balance" is neutral, "debt" feels heavy |
| Settle up | Pay back, Reimburse | Casual tone — friends settling, not invoicing |
| Member | User, Player | They're group members |
| Group | Team, Organization | It's a friend group, not a company |
| Admin | Owner, Manager | One person runs the group |
| Split | Divide, Share | "Split the expense" is the natural phrase |
| Log | Create, Add, Record | "Log an expense" — quick and casual |

---

## 9. Key Product Decisions (Opinionated)

1. **Vercel Blob for MVP storage** — JSON files, dead simple. No database setup. Migrate to Prisma/SQLite in Phase 2 when we need relational queries. This is a friend group app — Blob is fine for v1.

2. **No auth in MVP** — The group trusts each other. Admin manages access by sharing the URL. Add proper auth in Phase 2 when we need permissions. Shipping > perfection.

3. **Equal split as default** — 90% of badminton expenses are split equally ("$40 court, 8 people, $5 each"). Make the common case effortless. Custom amounts can wait for Phase 2.

4. **Single group only** — One deployment = one group. This simplifies everything. If another group wants it, they deploy their own instance.

5. **Dark mode as default** — Matches the design system. One theme. No toggle in MVP.

6. **Mobile-first but not mobile-only** — Primary use is at the court on phones. Desktop works but isn't optimized for.

---

## 10. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Group doesn't adopt it (stays on WhatsApp) | Medium | Fatal | Make logging faster than typing in WhatsApp. Demo at next session. |
| Admin burnout (only one person logs expenses) | Medium | High | Make logging so easy it's not a chore (< 60 sec). Consider letting trusted members log too. |
| Vercel Blob data loss | Low | High | JSON is easy to back up. Export feature in Phase 3. Migrate to proper DB in Phase 2. |
| Scope creep ("can we add X?") | High | Medium | Point to this document. If it's not in the phase, it waits. |
| Feature parity pressure ("Splitwise does X") | Medium | Medium | We're not Splitwise. We're a simple tool for one group. Less is more. |

---

*Last updated: 2026-04-20*
*Next step: Pass to UI/UX Designer for wireframes → Tech Architect for implementation plan*
