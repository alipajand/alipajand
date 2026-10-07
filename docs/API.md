# API reference

The site has two server-side API routes. All other pages are statically generated at build time.

## `POST /api/contact`

Sends a contact form email via [Resend](https://resend.com).

### Request

```http
POST /api/contact
Content-Type: application/json
```

```json
{
  "name": "string",
  "email": "string (valid email)",
  "message": "string"
}
```

### Validation

All three fields are required. Invalid payloads return `400 Bad Request`.

### Response

| Status                      | Body                 | Meaning                   |
| --------------------------- | -------------------- | ------------------------- |
| `200 OK`                    | `{ "ok": true }`     | Email sent successfully   |
| `400 Bad Request`           | `{ "error": "..." }` | Missing or invalid fields |
| `500 Internal Server Error` | `{ "error": "..." }` | Resend API failure        |

### Environment variables required

| Variable           | Description                             |
| ------------------ | --------------------------------------- |
| `RESEND_API_KEY`   | Resend API key (server-side only)       |
| `CONTACT_TO_EMAIL` | Recipient address for incoming messages |

### Implementation

`app/api/contact/route.ts` — validates the request body, then calls the Resend SDK to deliver the email.

---

## `POST /api/webhooks/resend`

Receives [Resend webhooks](https://resend.com/docs/dashboard/webhooks/introduction) and forwards inbound mail sent to the `alipajand.com` domain (e.g. `info@alipajand.com`) to `CONTACT_EMAIL`.

### Behavior

- Verifies the Svix signature (`svix-id`, `svix-timestamp`, `svix-signature`) against `RESEND_WEBHOOK_SECRET`.
- Ignores every event type except `email.received`.
- Loads the inbound email and its attachments, then re-sends it from `RESEND_FROM` with `replyTo` set to the original sender (or their `Reply-To`), so replies from the inbox go straight back to them.
- Sends with idempotency key `inbound-forward/<email_id>`, so Resend retries never produce duplicates.

### Response

| Status                      | Meaning                                                |
| --------------------------- | ------------------------------------------------------ |
| `200 OK`                    | Forwarded, or event type ignored                       |
| `400 Bad Request`           | Signature verification failed                          |
| `500 Internal Server Error` | Loading or forwarding failed; Resend retries the event |
| `503 Service Unavailable`   | `RESEND_API_KEY` or `RESEND_WEBHOOK_SECRET` is not set |

### Setup

In Resend → Webhooks, point the endpoint at `https://alipajand.com/api/webhooks/resend`, subscribe to `email.received`, and copy its signing secret into `RESEND_WEBHOOK_SECRET`.

### Implementation

`app/api/webhooks/resend/route.ts`. Shared Resend helpers live in `utils/resend.ts`.

---

## Static data APIs (internal)

These are not HTTP endpoints — they are TypeScript modules used at build time.

| Module              | Export                             | Description                                                    |
| ------------------- | ---------------------------------- | -------------------------------------------------------------- |
| `utils/posts.ts`    | `getAllPosts()`, `getPostBySlug()` | Reads Markdown from `content/`, parses gray-matter frontmatter |
| `utils/metadata.ts` | `buildMetadata()`                  | Shared `generateMetadata` helper for all routes                |
| `data/*.ts`         | Named exports                      | Typed static content (experience, skills, education, etc.)     |
