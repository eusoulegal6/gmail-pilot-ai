
Backend is live. Building the frontend now.

## Plan

**1. New hook** `src/hooks/useFlaggedEmails.ts`
- Mirror `useSendSmartUsage` exactly: same Send Smart URL base + anon key, bridged session JWT, react-query.
- GET `/functions/v1/review-list`. Returns `{ items: FlaggedEmail[] }`.
- `staleTime: 30s`, `refetchInterval: 60s` so age stays fresh.

**2. New component** `src/components/dashboard/FlaggedEmailCard.tsx`
- Props: one `FlaggedEmail`.
- Layout: sender name + email (truncated), subject (bold), 2-line clamped snippet, footer row with received timestamp (`Intl.DateTimeFormat`) + age badge.
- Age badge via `Intl.RelativeTimeFormat`:
  - `<24h` → `bg-secondary text-secondary-foreground`
  - `1–3d` → amber tone using existing tokens
  - `>3d` → `bg-destructive/10 text-destructive`
- Left border accent (`border-l-4`) intensifies with age.

**3. New section** `src/components/dashboard/FlaggedReviewSection.tsx`
- Header: "Flagged for review" + count badge + refresh icon button.
- Grid: 1 col / md:2 / lg:3.
- States: 3 skeleton cards loading; friendly empty state with check icon; inline alert on error.

**4. Wire into dashboard**
- `src/pages/Dashboard.tsx`: insert `<Reveal id="review">…</Reveal>` between the top row and `SendSmartUsageCard`.
- `src/components/dashboard/DashboardHeader.tsx`: add "Review" nav link → `#review`, placed between Dashboard and Usage.

**5. Types**
Defined inline in the hook:
```ts
interface FlaggedEmail {
  id: string;
  createdAt: string;
  senderEmail: string;
  senderName: string | null;
  subject: string;
  snippet: string;
  reason?: string;
}
```

Semantic tokens only. No DB migrations. Pairing flow untouched.
