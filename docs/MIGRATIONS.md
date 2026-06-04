# Migrations and operational notes

## Content migrations

### Adding a new writing post

1. Create `content/<slug>.md` with gray-matter frontmatter:
   ```
   ---
   title: "Post title"
   date: "YYYY-MM-DD"
   description: "One-line summary"
   tags: ["tag1", "tag2"]
   ---
   ```
2. The slug is derived from the filename — **do not rename it after publishing** (SEO and external links will break).
3. Add the post to the `data/posts/` index if one exists.
4. Run `pnpm build` to verify static generation succeeds.

### Updating site content

All site copy lives in `data/*.ts`. Edit there and run `pnpm test && pnpm build` to validate.

## Environment and secrets

| Variable | Purpose | Where to set |
| --------------------- | --------------------------------- | -------------------- |
| `RESEND_API_KEY` | Contact form email sender | Vercel dashboard |
| `CONTACT_TO_EMAIL` | Recipient email address | Vercel dashboard |

**Security rules:**
- Never commit `.env` or `.env.local`. Both are in `.gitignore`.
- Use `.env.example` to document required variables without values.
- All secrets are server-side only — never prefix with `NEXT_PUBLIC_`.
- Rotate `RESEND_API_KEY` if it is ever exposed in a commit or log.

## Dependency upgrades

- Run `pnpm up --latest` on a branch, verify `pnpm test && pnpm build` pass before merging.
- Next.js major upgrades require reviewing the [Next.js upgrade guide](https://nextjs.org/docs/upgrading) for breaking changes to App Router and config.
- Do not upgrade `react` or `react-dom` to a version not supported by the current Next.js major.

## Vercel production deployments

- All pushes to `main` trigger an automatic Vercel production deployment.
- Preview deployments are generated for every PR.
- Environment variables must be set in the Vercel dashboard — they are not read from `.env` in production.
- `RESEND_API_KEY` must be set before the contact form works in any environment.

## Rollback

To roll back a production deployment: use the Vercel dashboard to promote a previous deployment. No database migrations are needed — the site is fully static except for the contact API route.
