# Migrations and operational notes

## Content migrations

### Adding a new writing post

1. Create `content/posts/<slug>.md` with YAML frontmatter:
   ```
   ---
   title: "Post title"
   date: "YYYY-MM-DD"
   excerpt: "One-line summary"
   tags: ["tag1", "tag2"]
   ---
   ```
   The full field list is in [DATA_MODEL.md](DATA_MODEL.md#frontmatter-schema).
2. The slug is derived from the filename. **Do not rename it after publishing** (SEO and external links will break).
3. A date after today in Toronto schedules the post. Read [decisions/writing-publication-policy.md](decisions/writing-publication-policy.md) first, because some surfaces still show a scheduled post before its date.
4. Run `pnpm test && pnpm build` to verify the post parses, passes the HTML allowlist and generates statically.

### Updating site content

All site copy lives in `data/*.ts`. Edit there and run `pnpm test && pnpm build` to validate.

## Environment and secrets

| Variable                | Purpose                                   | Where to set     |
| ----------------------- | ----------------------------------------- | ---------------- |
| `RESEND_API_KEY`        | Contact form email and inbound forwarding | Vercel dashboard |
| `RESEND_WEBHOOK_SECRET` | Verifies Resend inbound-mail webhooks     | Vercel dashboard |
| `CONTACT_EMAIL`         | Recipient inbox (optional; has a default) | Vercel dashboard |
| `RESEND_FROM`           | Sender on a verified domain (optional)    | Vercel dashboard |

**Security rules:**

- Never commit `.env` or `.env.local`. Both are in `.gitignore`.
- Use `.env.example` to document required variables without values.
- All secrets are server-side only — never prefix with `NEXT_PUBLIC_`.
- Rotate `RESEND_API_KEY` if it is ever exposed in a commit or log.

## Dependency upgrades

- Run `pnpm up --latest` on a branch, verify `pnpm test && pnpm build` pass before merging.
- Dependency overrides belong in `pnpm-workspace.yaml` (`overrides:`); pnpm does not read the npm-style `overrides` field in `package.json`.
- Next.js major upgrades require reviewing the [Next.js upgrade guide](https://nextjs.org/docs/upgrading) for breaking changes to App Router and config.
- Do not upgrade `react` or `react-dom` to a version not supported by the current Next.js major.

## Vercel production deployments

- All pushes to `main` trigger an automatic Vercel production deployment.
- Preview deployments are generated for every PR.
- Environment variables must be set in the Vercel dashboard — they are not read from `.env` in production.
- `RESEND_API_KEY` must be set before the contact form works in any environment.

## Rollback

To roll back a production deployment: use the Vercel dashboard to promote a previous deployment. No database migrations are needed: there is no database, and the only server code is the two API routes and the per-request rendering of `/` and `/writing`.
