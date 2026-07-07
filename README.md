# Frank's Food

Landing page for **Frank's Food** — a local food delivery service connecting
nearby farmers with people who want fresh, local produce.

The page asks one question: **are you a farmer looking to sell, or a buyer
looking for produce?** — then captures an email for that segment. This is the
core signal we measure with PostHog.

Built with Next.js 16 (App Router) + Tailwind CSS v4.

## Run locally

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Analytics (PostHog)

The two key events are already wired up in `app/page.tsx` via a safe `capture()`
helper that no-ops until PostHog is installed:

- `role_selected` — fired when someone picks farmer vs. buyer (`{ role }`)
- `waitlist_signup` — fired on email submit (`{ role, email }`)

To install PostHog, run the wizard from the project root:

```bash
npx --yes @posthog/wizard@latest
```

It detects Next.js, installs the SDK, sets env vars, and wires up autocapture.
Once it initializes `posthog`, the two events above start flowing with no
further code changes.

## Deploy (pajakenterprises domain)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) (auto-detects Next.js).
3. In the Vercel project → **Settings → Domains**, add your domain and follow
   the DNS instructions at your registrar.
