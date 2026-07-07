# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Frank's Food. Here's a summary of every change made:

- **`instrumentation-client.ts`** (new) — Initializes `posthog-js` for Next.js 15.3+ using the `instrumentation-client` entrypoint. Enables exception autocapture and debug mode in development.
- **`next.config.ts`** (updated) — Added reverse proxy rewrites (`/ingest/*` → PostHog ingestion, `/ingest/static/*` and `/ingest/array/*` → PostHog assets) so analytics traffic routes through your domain and avoids ad blockers. Also added `skipTrailingSlashRedirect: true`.
- **`app/page.tsx`** (updated) — Replaced the temporary `window.posthog` wrapper with a direct `posthog-js` import. Fixed a PII leak (email was being sent as a capture property; it now goes only to `posthog.identify()`). Added `role_switched` event. Added `posthog.identify()` on waitlist signup so person profiles are linked to the submitter's email.
- **`.env.local`** (new) — Created with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `role_selected` | User clicks a farmer or buyer card to indicate their role. | `app/page.tsx` |
| `waitlist_signup` | User submits the waitlist form with their email address. | `app/page.tsx` |
| `role_switched` | User clicks "Actually, I'm a [other role]" on the post-signup success screen. | `app/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/500720/dashboard/1809878)
- [Total waitlist signups](https://us.posthog.com/project/500720/insights/gClAjVPx)
- [Waitlist signups over time](https://us.posthog.com/project/500720/insights/n1Nhgc5O)
- [Signups by role](https://us.posthog.com/project/500720/insights/NrEfmv8i)
- [Role selection to signup funnel](https://us.posthog.com/project/500720/insights/bqVRhEh5)
- [Role switches after signup](https://us.posthog.com/project/500720/insights/LvEC9wO2)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm that `posthog.identify()` is also called when the page loads for a visitor who already signed up (e.g. via a stored email in localStorage) — the current implementation only identifies on form submit, so returning visitors will be on anonymous distinct IDs until they submit again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
