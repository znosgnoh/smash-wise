# Smash Wise — Technical Architecture

> Authored by: Tech Architect · 2026-04-20
> Status: Approved for MVP implementation

---

## 1. Data Models

### 1.1 TypeScript Interfaces

All monetary values stored as **integers in cents** to avoid floating-point issues. `$10.50` = `1050`.

```ts
// lib/types.ts

/** A member of the badminton group */
interface Member {
  id: string;          // nanoid, 12 chars
  name: string;        // display name
  active: boolean;     // false = soft-deleted
  createdAt: string;   // ISO 8601 UTC
}

/** An expense paid by one member, split among selected members */
interface Expense {
  id: string;
  description: string;
  amount: number;       // cents (integer)
  paidBy: string;       // member ID
  splitAmong: string[]; // member IDs (includes payer if they participated)
  createdAt: string;    // ISO 8601 UTC
}

/** A settlement (payment) from one member to another */
interface Settlement {
  id: string;
  fromId: string;       // who paid (the debtor)
  toId: string;         // who received (the creditor)
  amount: number;       // cents (integer)
  createdAt: string;    // ISO 8601 UTC
}

/** Root state — the entire JSON blob */
interface GroupState {
  version: 1;           // schema version for future migrations
  name: string;         // group name, e.g. "Badminton Crew"
  currency: string;     // ISO 4217 code, e.g. "SGD"
  members: Member[];
  expenses: Expense[];
  settlements: Settlement[];
  updatedAt: string;    // ISO 8601 UTC — last modification
}

/** A simplified balance transaction for display */
interface BalanceTransaction {
  from: string;         // debtor member ID
  to: string;           // creditor member ID
  amount: number;       // cents
}

/** Net balance for a single member */
interface MemberBalance {
  memberId: string;
  amount: number;       // positive = others owe them, negative = they owe others
}
```

### 1.2 Zod Schemas

Validation at every system boundary — Server Actions, API routes.

```ts
// lib/schemas.ts
import { z } from 'zod';

export const MemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50).trim(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
});

export const ExpenseSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1).max(200).trim(),
  amount: z.number().int().positive(),          // cents, must be > 0
  paidBy: z.string().min(1),
  splitAmong: z.array(z.string().min(1)).min(1), // at least 1 person
  createdAt: z.string().datetime(),
});

export const SettlementSchema = z.object({
  id: z.string().min(1),
  fromId: z.string().min(1),
  toId: z.string().min(1),
  amount: z.number().int().positive(),
  createdAt: z.string().datetime(),
});

export const GroupStateSchema = z.object({
  version: z.literal(1),
  name: z.string().min(1),
  currency: z.string().length(3),
  members: z.array(MemberSchema),
  expenses: z.array(ExpenseSchema),
  settlements: z.array(SettlementSchema),
  updatedAt: z.string().datetime(),
});

// --- Input schemas for Server Actions ---

export const AddMemberInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50).trim(),
});

export const AddExpenseInputSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200).trim(),
  amount: z.number().int().positive('Amount must be greater than 0'),
  paidBy: z.string().min(1, 'Payer is required'),
  splitAmong: z.array(z.string().min(1)).min(1, 'Select at least one member'),
});

export const SettleUpInputSchema = z.object({
  fromId: z.string().min(1),
  toId: z.string().min(1),
  amount: z.number().int().positive('Amount must be greater than 0'),
}).refine((data) => data.fromId !== data.toId, {
  message: 'Cannot settle with yourself',
});

export const RemoveMemberInputSchema = z.object({
  memberId: z.string().min(1),
});

export const DeleteExpenseInputSchema = z.object({
  expenseId: z.string().min(1),
});
```

### 1.3 JSON Blob Shape

What the stored JSON looks like:

```json
{
  "version": 1,
  "name": "Badminton Crew",
  "currency": "SGD",
  "members": [
    { "id": "m_abc123", "name": "Wei Ming", "active": true, "createdAt": "2026-04-20T10:00:00.000Z" },
    { "id": "m_def456", "name": "Sarah", "active": true, "createdAt": "2026-04-20T10:00:00.000Z" }
  ],
  "expenses": [
    {
      "id": "e_ghi789",
      "description": "Court booking",
      "amount": 4000,
      "paidBy": "m_abc123",
      "splitAmong": ["m_abc123", "m_def456"],
      "createdAt": "2026-04-20T14:30:00.000Z"
    }
  ],
  "settlements": [
    {
      "id": "s_jkl012",
      "fromId": "m_def456",
      "toId": "m_abc123",
      "amount": 2000,
      "createdAt": "2026-04-21T09:00:00.000Z"
    }
  ],
  "updatedAt": "2026-04-21T09:00:00.000Z"
}
```

---

## 2. Vercel Blob Storage Strategy

### 2.1 Design: Single Blob

**One JSON file** stores the entire group state. At MVP scale (5-20 members, ~100 expenses/year), this file will be **<50 KB** — well within Blob limits.

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Blob count | Single file | Eliminates consistency issues between files. Atomic read/write. |
| Blob path | `smash-wise/group-state.json` | Namespaced, predictable. |
| Access | `public` | Needed for Server Component `fetch`. No sensitive data in MVP (no auth). |
| Suffix | `addRandomSuffix: false` | Overwrites same path on every write. |

### 2.2 Read/Write Pattern

```ts
// lib/blob.ts
import { put, list } from '@vercel/blob';

const BLOB_PATH = 'smash-wise/group-state.json';

const DEFAULT_STATE: GroupState = {
  version: 1,
  name: 'Badminton Crew',
  currency: 'SGD',
  members: [],
  expenses: [],
  settlements: [],
  updatedAt: new Date().toISOString(),
};

export async function readGroupState(): Promise<GroupState> {
  const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });

  if (blobs.length === 0) {
    // First run — initialize with default state
    await writeGroupState(DEFAULT_STATE);
    return DEFAULT_STATE;
  }

  const response = await fetch(blobs[0].url, { cache: 'no-store' });
  const data = await response.json();
  return GroupStateSchema.parse(data); // validate on read
}

export async function writeGroupState(state: GroupState): Promise<void> {
  const validated = GroupStateSchema.parse(state); // validate on write
  validated.updatedAt = new Date().toISOString();

  await put(BLOB_PATH, JSON.stringify(validated), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}
```

### 2.3 Concurrency

**Last-write-wins** — acceptable for MVP:
- This is a friend group. The admin logs most expenses.
- Concurrent writes are practically impossible (1-3 expenses per week).
- Even if two writes collide, the damage is one lost expense — easily re-added.

Phase 2 mitigation: Prisma transactions provide proper atomicity.

### 2.4 Caching

- Server Components use `cache: 'no-store'` on blob fetches → always fresh data.
- No ISR or static generation — data changes unpredictably.
- Reads are fast (single small JSON fetch from Vercel's edge network).

### 2.5 Migration Path to Prisma

The JSON structure is intentionally designed to map 1:1 to relational tables:

| JSON | Prisma Model | Migration |
|------|-------------|-----------|
| `members[]` | `Member` table | Direct insert, `id` preserved |
| `expenses[]` | `Expense` + `ExpenseSplit` tables | Expense row + computed split rows |
| `settlements[]` | `Settlement` table | Direct insert |
| `splitAmong[]` | `ExpenseSplit` join table | `amount / splitAmong.length` per row |

Migration script reads the final blob JSON, inserts into Prisma tables, validates totals match.

---

## 3. Server Actions & API Design

### 3.1 Architecture Decision

| Concern | Approach | Why |
|---------|----------|-----|
| Reads | Server Components call `readGroupState()` directly | No API layer needed. RSC can call server-side code. |
| Mutations | Server Actions (`'use server'`) | Form-native, progressive enhancement, built-in revalidation. |
| API routes | None in MVP | No external consumers. Server Actions cover all mutations. |

### 3.2 Server Actions

All actions follow this pattern:
1. Parse & validate input with Zod `.safeParse()`
2. Read current state from blob
3. Validate business rules (member exists, no duplicate names, etc.)
4. Mutate state immutably
5. Write back to blob
6. `revalidatePath('/')` to refresh all routes
7. Return `ActionResult`

```ts
// Shared return type for all actions
type ActionResult =
  | { success: true }
  | { success: false; error: string };
```

#### Members — `lib/actions/members.ts`

| Action | Input | Validation | Output | Side Effects |
|--------|-------|------------|--------|-------------|
| `addMember` | `{ name: string }` | Name non-empty, ≤50 chars, no duplicate active names | `ActionResult` | Adds member, revalidates |
| `removeMember` | `{ memberId: string }` | Member exists, is active | `ActionResult` | Sets `active: false`, revalidates |

#### Expenses — `lib/actions/expenses.ts`

| Action | Input | Validation | Output | Side Effects |
|--------|-------|------------|--------|-------------|
| `addExpense` | `{ description, amount, paidBy, splitAmong[] }` | Amount > 0, payer exists & active, all split members exist & active, payer is in splitAmong | `ActionResult` | Adds expense, revalidates |
| `deleteExpense` | `{ expenseId: string }` | Expense exists | `ActionResult` | Removes expense, revalidates |

#### Settlements — `lib/actions/settlements.ts`

| Action | Input | Validation | Output | Side Effects |
|--------|-------|------------|--------|-------------|
| `settleUp` | `{ fromId, toId, amount }` | Amount > 0, both members exist & active, fromId ≠ toId | `ActionResult` | Adds settlement, revalidates |

### 3.3 Server Action Implementation Pattern

```ts
// lib/actions/expenses.ts
'use server';

import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { readGroupState, writeGroupState } from '@/lib/blob';
import { AddExpenseInputSchema } from '@/lib/schemas';
import type { ActionResult } from '@/lib/types';

export async function addExpense(input: unknown): Promise<ActionResult> {
  // 1. Validate
  const parsed = AddExpenseInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // 2. Read state
  const state = await readGroupState();

  // 3. Business rules
  const activeIds = new Set(state.members.filter(m => m.active).map(m => m.id));
  if (!activeIds.has(parsed.data.paidBy)) {
    return { success: false, error: 'Payer is not an active member' };
  }
  for (const id of parsed.data.splitAmong) {
    if (!activeIds.has(id)) {
      return { success: false, error: 'Split includes inactive member' };
    }
  }

  // 4. Mutate
  state.expenses.push({
    id: `e_${nanoid(12)}`,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  });

  // 5. Write
  await writeGroupState(state);

  // 6. Revalidate
  revalidatePath('/');

  return { success: true };
}
```

### 3.4 Data Flow Diagrams

**Log Expense:**
```
User opens /log
  → Server Component calls readGroupState()
  → Renders ExpenseForm (client) with member list as props
  → User fills form, submits
  → Server Action addExpense() runs on server
  → Reads blob → validates → appends expense → writes blob
  → revalidatePath('/') → page re-renders with fresh data
  → redirect('/history') or success toast
```

**View Dashboard:**
```
User opens /
  → Server Component calls readGroupState()
  → Calls computeBalances(state) in lib/balance.ts
  → Returns MemberBalance[] + BalanceTransaction[]
  → Renders balance cards (Server Component — no client JS needed)
```

**Settle Up:**
```
User taps "Settle" on a balance card
  → Opens SettleForm (client) pre-filled with from/to/amount
  → User confirms, submits
  → Server Action settleUp() runs on server
  → Reads blob → validates → appends settlement → writes blob
  → revalidatePath('/') → dashboard refreshes
```

---

## 4. State Management

### 4.1 Philosophy

**No client-side state library.** React Server Components + Server Actions handle 90% of state. Client Components only for interactive forms.

| Layer | Technology | What it holds |
|-------|-----------|--------------|
| Persistence | Vercel Blob | Source of truth — `GroupState` JSON |
| Server | RSC + `readGroupState()` | Fetches fresh data on every request |
| Client | `useActionState` (React 19) | Form submission state (pending, error) |
| URL | Search params | Prefill values, mode flags |

### 4.2 Data Flow Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│ Vercel Blob  │◄────►│ Server       │─────►│ Server      │
│ (JSON file)  │      │ Actions      │      │ Components  │
└─────────────┘      │ (mutations)  │      │ (reads)     │
                     └──────────────┘      └──────┬──────┘
                           ▲                       │
                           │ form submit           │ props
                           │                       ▼
                     ┌──────────────┐      ┌─────────────┐
                     │ Client       │      │ Client      │
                     │ Components   │      │ Components  │
                     │ (forms)      │      │ (display)   │
                     └──────────────┘      └─────────────┘
```

### 4.3 What's Server vs Client

| Component | Rendering | Why |
|-----------|----------|-----|
| Dashboard page | Server | Pure data display — balances, cards |
| Balance cards | Server | No interactivity needed |
| Expense history list | Server | Read-only display with month grouping |
| Bottom navigation | Client | Needs `usePathname()` for active state |
| Expense form | Client | Form state, input handlers, validation UX |
| Settle form | Client | Form state, amount input |
| Add member form | Client | Input handler |
| Member selector | Client | Checkbox interactions |
| Amount input | Client | Live formatting (cents ↔ display) |

### 4.4 URL State

Search params for contextual navigation — no client state needed:

| URL | Purpose |
|-----|---------|
| `/log` | Fresh expense form |
| `/log?payer=m_abc123` | Pre-select payer |
| `/log?members=m_abc,m_def` | Pre-select split members |
| `/history?month=2026-04` | Jump to specific month (future) |

Implemented via `searchParams` prop in Server Components — zero client JS.

---

## 5. Project Structure

```
smash-wise/
├── app/
│   ├── globals.css                 # Tailwind imports + theme tokens
│   ├── layout.tsx                  # Root layout: fonts, dark bg, <Nav>
│   ├── page.tsx                    # Dashboard — balances overview
│   ├── loading.tsx                 # Dashboard skeleton
│   ├── log/
│   │   └── page.tsx                # Log expense page
│   ├── history/
│   │   └── page.tsx                # Expense + settlement history
│   └── members/
│       └── page.tsx                # Member management
│
├── components/                     # Shared UI components
│   ├── nav.tsx                     # Bottom tab bar (client)
│   ├── balance-list.tsx            # Simplified balance list (server)
│   ├── balance-card.tsx            # Single "A owes B $X" row (server)
│   ├── expense-card.tsx            # Expense row in history (server)
│   ├── settlement-card.tsx         # Settlement row in history (server)
│   ├── month-group.tsx             # Month header divider (server)
│   ├── member-avatar.tsx           # Circle with name initial (server)
│   ├── member-list.tsx             # List of members (server)
│   ├── empty-state.tsx             # Empty state placeholder (server)
│   ├── expense-form.tsx            # Log expense form (client)
│   ├── settle-form.tsx             # Settle up form (client)
│   ├── member-form.tsx             # Add member form (client)
│   ├── member-selector.tsx         # Multi-select checkboxes (client)
│   ├── amount-input.tsx            # Currency input with formatting (client)
│   └── submit-button.tsx           # Form submit with pending state (client)
│
├── lib/
│   ├── types.ts                    # All TypeScript interfaces
│   ├── schemas.ts                  # All Zod schemas
│   ├── blob.ts                     # Vercel Blob read/write
│   ├── balance.ts                  # Balance calculation algorithm
│   ├── format.ts                   # formatCurrency(), formatDate()
│   ├── ids.ts                      # ID generation (nanoid wrappers)
│   ├── constants.ts                # DEFAULT_STATE, CURRENCY config
│   └── actions/
│       ├── members.ts              # addMember, removeMember
│       ├── expenses.ts             # addExpense, deleteExpense
│       └── settlements.ts          # settleUp
│
├── prisma/
│   └── schema.prisma               # Phase 2 schema (preview, not used in MVP)
│
├── docs/
│   ├── product-bible.md
│   └── technical-architecture.md   # This document
│
├── public/                         # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── .env.local                      # BLOB_READ_WRITE_TOKEN
```

### File Count: ~30 files for MVP

### Why `components/` at root instead of `app/_components/`

Both work. Root-level `components/` is chosen because:
1. Shorter import paths: `@/components/nav` vs `@/app/_components/nav`
2. Clearer separation: `app/` = routes, `components/` = UI, `lib/` = logic
3. Standard convention in most Next.js projects

---

## 6. Balance Calculation Algorithm

### 6.1 Overview

Two-step process:
1. **Net balances** — compute what each member's net position is
2. **Debt simplification** — minimize the number of transactions to settle all debts

### 6.2 Step 1: Compute Net Balances

"Net balance" = how much others owe you (positive) or you owe others (negative).

```ts
// lib/balance.ts

export function computeNetBalances(
  members: Member[],
  expenses: Expense[],
  settlements: Settlement[]
): Map<string, number> {
  const balances = new Map<string, number>();

  // Initialize all active members at 0
  for (const member of members) {
    if (member.active) balances.set(member.id, 0);
  }

  // Process expenses
  for (const expense of expenses) {
    const splitCount = expense.splitAmong.length;
    const share = Math.floor(expense.amount / splitCount);
    const remainder = expense.amount - share * splitCount;

    // Payer gets credited the full amount
    balances.set(
      expense.paidBy,
      (balances.get(expense.paidBy) ?? 0) + expense.amount
    );

    // Each participant gets debited their share
    for (let i = 0; i < expense.splitAmong.length; i++) {
      const memberId = expense.splitAmong[i];
      // First `remainder` members pay 1 extra cent (handles rounding)
      const memberShare = share + (i < remainder ? 1 : 0);
      balances.set(memberId, (balances.get(memberId) ?? 0) - memberShare);
    }
  }

  // Process settlements (from pays to)
  for (const settlement of settlements) {
    balances.set(
      settlement.fromId,
      (balances.get(settlement.fromId) ?? 0) + settlement.amount
    );
    balances.set(
      settlement.toId,
      (balances.get(settlement.toId) ?? 0) - settlement.amount
    );
  }

  return balances;
}
```

**Rounding strategy:** `Math.floor` for per-person share, distribute remainder 1 cent at a time to the first N participants. Guarantees total debits === total credits. At most a 1-2 cent difference per person — negligible.

### 6.3 Step 2: Simplify Debts (Minimize Transactions)

Greedy algorithm — matches largest debtor with largest creditor repeatedly:

```ts
export function simplifyDebts(
  netBalances: Map<string, number>
): BalanceTransaction[] {
  const creditors: Array<{ id: string; amount: number }> = [];
  const debtors: Array<{ id: string; amount: number }> = [];

  for (const [id, amount] of netBalances) {
    if (amount > 0) creditors.push({ id, amount });
    if (amount < 0) debtors.push({ id, amount: -amount }); // store as positive
  }

  // Sort descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions: BalanceTransaction[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const transfer = Math.min(creditors[ci].amount, debtors[di].amount);

    transactions.push({
      from: debtors[di].id,
      to: creditors[ci].id,
      amount: transfer,
    });

    creditors[ci].amount -= transfer;
    debtors[di].amount -= transfer;

    if (creditors[ci].amount === 0) ci++;
    if (debtors[di].amount === 0) di++;
  }

  return transactions;
}
```

### 6.4 Complexity

- Net balance computation: **O(E × M)** where E = expenses, M = avg members per expense
- Debt simplification: **O(N log N)** where N = members (dominated by sort)
- For 20 members and 500 expenses: **< 1ms** — no optimization needed

### 6.5 Example

```
Expenses:
  Court $40 paid by Wei Ming, split [Wei Ming, Sarah, John, Lisa]
  Shuttles $20 paid by Sarah, split [Wei Ming, Sarah, John, Lisa]
  Drinks $12 paid by Wei Ming, split [Wei Ming, Sarah]

Net balances:
  Wei Ming: +40 - 10 + 0 - 5 + 12 - 6 = +31  (owed $0.31)
  Sarah:    0 - 10 + 20 - 5 + 0 - 6   = -1    (owes $0.01)
  John:     0 - 10 + 0 - 5             = -15   (owes $0.15)
  Lisa:     0 - 10 + 0 - 5             = -15   (owes $0.15)

Simplified:
  John → Wei Ming: $0.15
  Lisa → Wei Ming: $0.15
  Sarah → Wei Ming: $0.01
```

---

## 7. Prisma Schema Preview (Phase 2)

Designed now so MVP data model aligns with the relational target.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "sqlite"    // → "postgresql" in production
  url      = env("DATABASE_URL")
}

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
  amount      Int      // cents
  paidById    String
  paidBy      Member   @relation("PaidBy", fields: [paidById], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  splits ExpenseSplit[]

  @@index([paidById])
  @@index([createdAt])
}

model ExpenseSplit {
  id        String  @id @default(cuid())
  expenseId String
  expense   Expense @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  memberId  String
  member    Member  @relation(fields: [memberId], references: [id])
  amount    Int     // cents — this member's share

  @@unique([expenseId, memberId])
  @@index([memberId])
}

model Settlement {
  id        String   @id @default(cuid())
  fromId    String
  from      Member   @relation("SettlementFrom", fields: [fromId], references: [id])
  toId      String
  to        Member   @relation("SettlementTo", fields: [toId], references: [id])
  amount    Int      // cents
  createdAt DateTime @default(now())

  @@index([fromId])
  @@index([toId])
  @@index([createdAt])
}
```

### MVP → Prisma Migration Mapping

| MVP (JSON) | Prisma | Transformation |
|------------|--------|---------------|
| `member.id` (nanoid) | `Member.id` (cuid) | Generate new cuid, keep mapping table |
| `expense.splitAmong[]` | `ExpenseSplit` rows | Create one row per member with calculated `amount` |
| `expense.amount` (cents) | `Expense.amount` (Int) | Direct copy |
| `settlement.*` | `Settlement.*` | Direct copy with remapped IDs |

### Why `ExpenseSplit` as a separate table?

The MVP stores `splitAmong: string[]` (equal split). Phase 2 adds **custom/unequal splits**. The join table with per-member `amount` supports both:
- Equal split: `amount = expense.amount / splitCount` (with rounding)
- Custom split: `amount` = whatever the user entered

---

## 8. Scalability Roadmap

### Phase 1 → Phase 2: Blob → Prisma

| Concern | Change | Effort |
|---------|--------|--------|
| Storage | `lib/blob.ts` → `lib/prisma.ts` | Medium — rewrite data access layer |
| Actions | Same interface, different implementation | Low — swap blob calls for Prisma queries |
| Types | Keep interfaces, add Prisma-generated types | Low |
| Balance calc | No change — same algorithm, different data source | None |
| Auth | Add NextAuth/Clerk, protect actions | Medium |
| Permissions | Add `role` field to Member, check in actions | Low |
| Migration | One-time script: read blob → insert Prisma | Low — write once |
| Components | No change — Server Components still fetch data the same way | None |

**Key design decision:** Server Actions return `ActionResult` in both phases. The interface doesn't change — only the implementation behind `readGroupState()` / `writeGroupState()`.

### Phase 2 → Phase 3: Polish

| Concern | What Changes |
|---------|-------------|
| Notifications | Add notification service (email/push). Trigger from Server Actions after mutations. |
| Stats | New queries against Prisma (aggregations). New `/stats` route. |
| Export | Server Action that generates CSV from Prisma data. |
| Edit/delete | Add `updateExpense` and soft-delete patterns. Activity log table. |
| Categories | Add `category` field to Expense model. Enum: `court`, `shuttle`, `food`, `other`. |
| Custom splits | `ExpenseSplit.amount` already supports this. Update form UI only. |

---

## 9. Technical Decisions

### 9.1 ID Generation: `nanoid`

| Option | Size | Speed | URL-safe | Package size |
|--------|------|-------|----------|-------------|
| **nanoid** ✅ | 12 chars | Fast | Yes | 130 bytes |
| uuid v4 | 36 chars | Fast | No (dashes) | 800 bytes |
| cuid | 25 chars | Fast | Yes | Larger |
| Incrementing | Variable | N/A | Yes | None |

**Decision:** `nanoid` with 12-char IDs, prefixed by type:
- Members: `m_` + nanoid(12) → `m_V1StGXR8_Z5j`
- Expenses: `e_` + nanoid(12)
- Settlements: `s_` + nanoid(12)

Prefixes make debugging easier (you can tell what an ID refers to at a glance). Collision probability at 12 chars: ~1% after 5 million IDs. We'll have <1000 total entities.

Phase 2 switches to Prisma's `cuid()` for new records. Old nanoid IDs remain valid.

### 9.2 Currency: Integers in Cents

**Decision:** All monetary values stored as **integers in cents**.

```ts
// $10.50 → 1050
// $0.01 → 1

// Display:
function formatCurrency(cents: number, currency = 'SGD'): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}
```

Why:
- No floating-point bugs (`0.1 + 0.2 !== 0.3`)
- Integer math for splitting is exact
- Prisma `Int` maps directly
- Industry standard (Stripe, Square, etc.)

### 9.3 Date Handling

**Store:** ISO 8601 UTC strings in JSON. `DateTime` (UTC) in Prisma.
**Display:** `Intl.DateTimeFormat` with user's local timezone.

```ts
function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

function formatRelative(iso: string): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days < 7) return rtf.format(-days, 'day');
  return formatDate(iso);
}
```

### 9.4 Error Handling Strategy

**Three layers:**

1. **Validation errors** (Zod) — returned as `{ success: false, error: "..." }` from Server Actions. Displayed inline in forms via `useActionState`.

2. **Infrastructure errors** (blob read/write fails) — caught in Server Actions, return generic error. Logged server-side. User sees "Something went wrong, please try again."

3. **Route-level errors** — `error.tsx` boundary per route. Catches rendering failures. Shows retry button.

```
Form input → Zod validates → Action runs → Blob I/O
     ↓              ↓              ↓           ↓
  Client          Return         Return     error.tsx
  validation      error msg      error msg   boundary
```

### 9.5 Optimistic UI

**Decision:** Not in MVP.

Rationale:
- Writes are infrequent (few per week)
- Server Actions with `revalidatePath` provide <500ms feedback
- `useActionState` gives pending state for loading indicators
- Adding `useOptimistic` doubles the code complexity for minimal UX gain

Phase 2: Consider `useOptimistic` for expense logging if users complain about perceived latency.

### 9.6 URL-based State

**Decision:** Use `searchParams` for prefilling forms, not client-side state.

```
/log                          → blank expense form
/log?payer=m_abc123           → pre-selected payer
/log?members=m_abc,m_def      → pre-selected split members
```

Benefits:
- Shareable links ("log this for me")
- Browser back/forward works naturally
- Zero client JavaScript for state management
- Server Component reads `searchParams` prop directly

### 9.7 Form Handling

**Decision:** React 19 `useActionState` + Server Actions.

```tsx
// Client Component
'use client';

import { useActionState } from 'react';
import { addExpense } from '@/lib/actions/expenses';

function ExpenseForm({ members }: ExpenseFormProps) {
  const [state, action, isPending] = useActionState(addExpense, null);

  return (
    <form action={action}>
      {/* fields */}
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Log Expense'}
      </button>
      {state?.success === false && (
        <p className="text-red-400">{state.error}</p>
      )}
    </form>
  );
}
```

### 9.8 Dependencies (MVP)

Minimal footprint — only what's needed:

| Package | Purpose | Size |
|---------|---------|------|
| `next` | Framework | (already installed) |
| `react` / `react-dom` | UI | (already installed) |
| `tailwindcss` | Styling | (already installed) |
| `@vercel/blob` | Storage | ~15 KB |
| `zod` | Validation | ~13 KB |
| `nanoid` | ID generation | ~130 B |
| `motion` | Animations | ~32 KB |

**No additional dependencies needed.** No state library, no ORM, no CSS-in-JS, no utility belt.

---

## Architecture Decision Records (ADRs)

### ADR-001: Single JSON Blob vs Multiple Blobs

- **Context:** Need to persist group state in Vercel Blob for MVP.
- **Options:** (A) Single JSON file with all data. (B) Separate blobs per entity type (`members.json`, `expenses.json`). (C) One blob per expense.
- **Decision:** (A) Single JSON file.
- **Reasoning:** Atomic reads/writes. No consistency issues. Total data <50 KB. Simpler code — one `readGroupState()` call gets everything.
- **Consequences:** Entire state read/written on every mutation. Acceptable at MVP scale.
- **Reversibility:** Easy — data model stays the same regardless of storage layout.

### ADR-002: Server Actions vs API Routes

- **Context:** Need mutation endpoints for forms.
- **Options:** (A) Server Actions with `'use server'`. (B) API route handlers (`app/api/*/route.ts`). (C) Mix of both.
- **Decision:** (A) Server Actions only for MVP.
- **Reasoning:** No external API consumers. Server Actions provide progressive enhancement (works without JS), built-in revalidation, simpler code. Forms use `action` prop directly.
- **Consequences:** No REST API. If a mobile app needs one in Phase 4, add route handlers then.
- **Reversibility:** Easy — extract action logic to shared service functions, expose via both actions and routes.

### ADR-003: No Client-Side State Library

- **Context:** How to manage application state.
- **Options:** (A) React Server Components + `useActionState`. (B) Zustand/Jotai for client state. (C) React Context + useReducer.
- **Decision:** (A) No state library. Server = source of truth.
- **Reasoning:** RSC fetches fresh data every render. Forms use `useActionState` for pending/error. No shared client state needed — each page independently fetches.
- **Consequences:** Every page reads from blob. No stale cache issues, but no offline support.
- **Reversibility:** Easy — add a library later if needed.

### ADR-004: Soft Delete for Members

- **Context:** What happens when a member is removed who has existing expenses.
- **Options:** (A) Hard delete + cascade expenses. (B) Soft delete (`active: false`), hide from UI. (C) Prevent deletion if has expenses.
- **Decision:** (B) Soft delete.
- **Reasoning:** Preserves expense history integrity. Historical expenses still reference the member. UI filters by `active: true` for forms, shows all in history.
- **Consequences:** Data never truly deleted. Acceptable for a small group.
- **Reversibility:** Easy.

---

*This architecture is intentionally simple. Every decision can be revisited when complexity demands it — but not before.*
