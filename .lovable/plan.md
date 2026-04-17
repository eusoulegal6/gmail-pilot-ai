

## Goal
Make the shared Supabase auth project (`uxhtrpwgfqknxqzhssoe`) deliver a 6-digit OTP code in the passwordless email so the Chrome extension's code-entry flow works. Keep the web app on the same project/accounts, and add OTP-entry support to the web Auth page so the same email works in both surfaces.

## Investigation summary
- Web auth page (`src/pages/Auth.tsx`) uses `signInWithPassword` + `signUp` (email confirm link) + Google OAuth. No magic link / OTP code path exists yet.
- AuthContext is standard `onAuthStateChange` — no changes needed.
- Project has Lovable Cloud / Supabase Auth with a `handle_new_user` trigger that creates a profile row. This works for OTP signups too (a new `auth.users` row is still created the first time an email verifies).
- No custom `auth-email-hook` edge function exists, so Supabase is sending the default magic-link email template, which by default renders the link only and not the token.

## Plan

### 1. Customize the Supabase auth email templates (the actual fix)
Scaffold Lovable's auth email templates so we control what the email contains. We'll edit two of the six templates to put the **6-digit code** front and center:

- **Magic Link template** (what `signInWithOtp` sends): show the code prominently using `{{ .Token }}`, with a smaller fallback "or click to sign in on the web" link using `{{ .ConfirmationURL }}`. Copy mentions this is for signing into the **Send Smart extension**, that the code expires (default 1 hour), and to ignore if not requested.
- **Signup confirmation template** (first-time email signup): same pattern — code prominent, link as fallback — so a brand-new user signing in from the extension also gets a usable code.

Other templates (recovery, invite, email-change, reauthentication) get light brand styling but no behavioral change.

Prerequisite: an email sender domain. If none is configured, we'll show the email-setup dialog first; otherwise we proceed directly to scaffold + deploy.

### 2. Add OTP code-entry to the web Auth page
Currently `src/pages/Auth.tsx` only supports password + Google. To keep web and extension on the **same flow and same email**, add a third tab/mode:

- New "Email code" mode with two steps:
  1. Enter email → call `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: window.location.origin } })`
  2. Show 6-digit code input (using existing `src/components/ui/input-otp.tsx`) → call `supabase.auth.verifyOtp({ email, token, type: 'email' })`
- "Resend code" link and a "Back to email" link.
- Keep existing password + Google options intact (no breaking change for current users).

### 3. No backend/schema changes
- Same Supabase project `uxhtrpwgfqknxqzhssoe`.
- Same `auth.users`, same `profiles`, same `handle_new_user` trigger — all work identically for OTP.
- No migrations.

## Files to change
- `supabase/functions/_shared/email-templates/magic-link.tsx` — code-first layout using `{{ .Token }}`
- `supabase/functions/_shared/email-templates/signup.tsx` — code-first layout using `{{ .Token }}`
- `supabase/functions/_shared/email-templates/{recovery,invite,email-change,reauthentication}.tsx` — brand styling only
- `supabase/functions/auth-email-hook/` — scaffolded, then deployed
- `src/pages/Auth.tsx` — add Email Code tab (request code → verify code), keep password + Google

## Final email template (Magic Link / sign-in code) — content preview
> **Subject:** Your Send Smart sign-in code
>
> Hi,
>
> Use this code to sign in to the **Send Smart** extension:
>
> ## `{{ .Token }}`
>
> This code expires in 1 hour. Enter it in the extension's sign-in screen to continue.
>
> Prefer to sign in on the web instead? [Sign in here]({{ .ConfirmationURL }})
>
> If you didn't request this code, you can safely ignore this email.
>
> — The Send Smart team

(The Signup confirmation email follows the same pattern with "Welcome to Send Smart — confirm with this code" wording.)

## Answers to your "output" checklist
- **What changed:** Auth email templates (magic-link + signup) now lead with `{{ .Token }}` for the extension; `{{ .ConfirmationURL }}` kept as a secondary "sign in on the web" fallback. No Supabase project change.
- **Web app needs OTP entry:** Yes — added as a new "Email code" mode on `/auth` so users on the web can also paste the same code (or just click the fallback link).
- **Frontend changes still needed:** Just the `Auth.tsx` update described above. AuthContext, ProtectedRoute, Dashboard unchanged.
- **Risks to magic-link assumptions:** Low. The fallback `{{ .ConfirmationURL }}` link still works exactly like today's magic link and lands on the site origin, so any existing flow that expected a clickable link still functions. The only behavioral change is that the email now leads with a code.
- **Shared project confirmation:** Stays on `uxhtrpwgfqknxqzhssoe`. Same users, same accounts across web and extension.

