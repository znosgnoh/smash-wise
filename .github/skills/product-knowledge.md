# Smash Wise Product Knowledge Skill

Core product knowledge for anyone working on Smash Wise. Reference this for terminology, user personas, and product positioning. Full product bible at `docs/product-bible.md`.

## What Smash Wise Is

**Share badminton money and sweat** — A shared expense tracker for a small, trusted badminton friend group. One question answered: "Who owes whom, and how much?"

- Shared expense tracker for a small friend group (5-20 people)
- Quick-glance dashboard — open, see balances, done
- Simple ledger — expenses in, balances out
- Admin-controlled — one person manages the group
- Mobile-first web app — used at the court on phones
- Personal/hobby project — built for real use, not for scale

## What Smash Wise Is NOT

- Not a Splitwise competitor — no marketplace, no multi-group juggling, no ads
- Not a payments app — no Venmo/PayNow, settle up in person
- Not a social network — no feeds, comments, or reactions
- Not a budgeting tool — no categories reports, no savings goals
- Not multi-tenant SaaS — one deployment, one friend group
- Not a booking/scheduling app

## Language Guide

| Always Use | Never Use | Why |
|-----------|----------|-----|
| Session | Game, Match | A "session" is one meetup at the court |
| Expense | Transaction, Payment | We track expenses, not payments |
| Balance | Debt, Owing | Neutral tone |
| Settle up | Pay back, Reimburse | Casual, not invoicing |
| Member | User, Player | Group members |
| Group | Team, Organization | Friend group, not a company |
| Admin | Owner, Manager | One person runs the group |
| Split | Divide, Share | "Split the expense" |
| Log | Create, Add, Record | "Log an expense" — quick and casual |

## Target Personas

### Primary — "The Organizer" (Admin)
- **Who:** The friend who books courts and collects money
- **Behavior:** Tracks expenses in WhatsApp or Notes app, loses track after 3 sessions
- **Wants:** Single place to log expenses and see who owes what
- **Pain:** Mental overhead of tracking, awkward "you owe me" messages
- **Usage:** Logs expenses after each session (1-3 min), checks balances weekly

### Secondary — "The Regular" (Player)
- **Who:** Friends who play regularly, want to pay their fair share
- **Behavior:** Trusts organizer, occasionally asks "do I owe anything?"
- **Wants:** Quick way to see their balance without asking
- **Pain:** Guilt/embarrassment of not knowing their balance
- **Usage:** Opens app when reminded, checks balance (30 sec)

### Tertiary — "The Drop-in" (Occasional)
- **Who:** Friends who join sporadically
- **Wants:** Only included in expenses for sessions they attended
- **Pain:** Being charged for sessions they missed
- **Usage:** Checks app rarely

## Core User Loop

```
OPEN → "I just paid for courts, let me log it"
ACTION → Log expense, split among attendees
REWARD → Instant balance update, everyone sees who owes what
RETURN → Next session (1-3x/week), same loop
```

## Core Metrics (North Stars)

**North Star:** Expenses logged per week

| Metric | Definition | Target (MVP) |
|--------|-----------|---------------|
| Adoption | All group members opened the app | 100% of group |
| Weekly logging | At least 1 expense per session | > 90% of sessions |
| Balance checks | Members who check balance weekly | > 50% |
| Time to log | Open app → expense submitted | < 60 seconds |

## Competitive Landscape

| App | Strengths | Weaknesses | Our Differentiator |
|-----|-----------|------------|-------------------|
| Splitwise | Full-featured, multi-group, payments | Ads, complex, overkill for one group | Purpose-built for one badminton group, zero friction |
| WhatsApp notes | Everyone has it | No math, no history, gets buried | Automatic balance calculation, persistent history |
| Spreadsheet | Flexible | Clunky on mobile, manual math | Mobile-first, auto-splitting |

## Product Phases

### Phase 1: MVP — "Replace the WhatsApp Ledger"
- Group dashboard with member balances
- Add expense (amount, payer, split among selected members)
- Expense history list
- Equal split among selected members
- Admin: add/remove members
- Settle up (record payment)
- Responsive mobile-first dark UI
- Simplified balances (minimize transactions)
- **Tech:** Next.js, Vercel Blob (JSON), Vercel deploy. No auth.

### Phase 2: "Lock It Down" — Auth & Persistence
- User authentication (email/social login)
- Role-based permissions (admin/member)
- Database migration (Blob → SQLite/Prisma)
- Edit/delete expense (admin only)
- Expense categories (court, shuttle, food, other)
- Unequal/custom splits
- Activity log

### Phase 3: "Quality of Life" — Polish & Convenience
- Push/email notifications
- Monthly summary
- Export to CSV
- Multiple groups
- Recurring expense templates
- Fun stats (most generous payer, biggest spender)

## Anti-Goals

- No payment integration (settle in person)
- No multi-tenancy (one deploy = one group)
- No complex splitting (equal or custom amounts only)
- No social features (no comments, reactions, chat)
- No offline support
- No i18n / multi-currency
- No native mobile app
