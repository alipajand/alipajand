# API reference

The site has two server-side API routes. Every page is generated at build time (see [ROUTES.md](ROUTES.md)).

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

The site's form puts the optional company field into `message` as a leading `Company: …` line
(`composeContactMessage` in `utils/contactFields.ts`).

### Validation

- `Content-Type` must be `application/json` (parameters such as `; charset=utf-8` are allowed).
  Anything else gets `415`, so a plain HTML form on another site cannot post here without a CORS
  preflight, which this route does not grant.
- The body is read with a 64 KB cap; a larger body gets `413`.
- The body must be a JSON object. Malformed JSON, an empty body, `null`, an array or a string gets
  `400`.
- `name`, `email` and `message` are required after trimming. Limits come from
  `utils/contactFields.ts`: name 200, message 10,000 and email 254 characters. Control characters
  in the name collapse to one space, because it is used in the subject line.

### Response

| Status                       | Body                  | Meaning                                                  |
| ---------------------------- | --------------------- | -------------------------------------------------------- |
| `200 OK`                     | `{ "success": true }` | Email accepted by Resend                                 |
| `400 Bad Request`            | `{ "error": "..." }`  | Body is not a JSON object, or a field is missing/invalid |
| `413 Payload Too Large`      | `{ "error": "..." }`  | Body over 64 KB                                          |
| `415 Unsupported Media Type` | `{ "error": "..." }`  | Content type is not `application/json`                   |
| `429 Too Many Requests`      | `{ "error": {...} }`  | Rate limit exceeded                                      |
| `500 Internal Server Error`  | `{ "error": "..." }`  | Resend refused or failed to send                         |
| `503 Service Unavailable`    | `{ "error": "..." }`  | `RESEND_API_KEY` is not set                              |

`429` is returned by a Vercel Firewall rule before the request reaches the handler. Its body is the firewall's own JSON, where `error` is an object (`code`, `message`, `id`) rather than a string. The form shows `CONTACT_FORM_ERROR_RATE_LIMITED` for it, and its generic message for any `400`. See [CONTACT_RATE_LIMIT.md](CONTACT_RATE_LIMIT.md).

### Environment variables

| Variable         | Description                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| `RESEND_API_KEY` | Resend API key (server-side only); without it the route answers `503`        |
| `CONTACT_EMAIL`  | Recipient address; optional, `utils/resend.ts` has a default                 |
| `RESEND_FROM`    | Sender on a verified domain; optional, falls back to `onboarding@resend.dev` |

### Implementation

`app/api/contact/route.ts` checks the content type and size, parses and validates the body, then sends the email through the Resend SDK with the visitor's address as `replyTo`. Provider error details are logged on the server and not returned.

---

## `POST /api/webhooks/resend`

Receives [Resend webhooks](https://resend.com/docs/dashboard/webhooks/introduction) and forwards inbound mail sent to the `alipajand.com` domain (e.g. `info@alipajand.com`) to `CONTACT_EMAIL`.

### Behavior

- Verifies the Svix signature (`svix-id`, `svix-timestamp`, `svix-signature`) against `RESEND_WEBHOOK_SECRET`.
- Ignores every event type except `email.received`.
- Ignores inbound mail unless one of its recipients (`received_for`, falling back to `To`/`Cc`) is an `@alipajand.com` address. The Resend account also receives mail for other domains, which must not reach the personal inbox.
- Loads the inbound email and its attachments, then re-sends it from `RESEND_FROM` with `replyTo` set to the original sender (or their `Reply-To`), so replies from the inbox go straight back to them.
- Sends with idempotency key `inbound-forward/<email_id>`, so Resend retries never produce duplicates.

### Response

| Status                      | Meaning                                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `200 OK`                    | Forwarded, or event type / recipient domain ignored                                                                                 |
| `400 Bad Request`           | Signature verification failed, or the signed body is not a valid event (no `type`, or an `email.received` event without `email_id`) |
| `500 Internal Server Error` | Loading or forwarding failed; Resend retries the event                                                                              |
| `503 Service Unavailable`   | `RESEND_API_KEY` or `RESEND_WEBHOOK_SECRET` is not set                                                                              |

### Setup

In Resend → Webhooks, point the endpoint at `https://alipajand.com/api/webhooks/resend`, subscribe to `email.received`, and copy its signing secret into `RESEND_WEBHOOK_SECRET`. `RESEND_API_KEY` must be a **Full access** key: reading received emails fails with a sending-only key.

### Implementation

`app/api/webhooks/resend/route.ts`. Shared Resend helpers live in `utils/resend.ts`.

---

## Static data APIs (internal)

These are not HTTP endpoints. They are TypeScript modules used at build time.

| Module              | Export                                                                         | Description                                                                     |
| ------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `utils/posts.ts`    | `getAllPosts()`, `getPostBySlug()`, `getPublishedPosts()`, `getPostMarkdown()` | Reads `content/posts/*.md`, parses YAML frontmatter, renders and sanitises HTML |
| `utils/metadata.ts` | `buildArticleMetadata()`, `buildNowMetadata()` and one builder per route       | Per-route Next.js `Metadata`                                                    |
| `utils/projects.ts` | `getProjectBySlug()`, `getDedicatedCaseStudyProjects()`, `toPublicProject()`   | Case-study lookup with the public-claim filter applied                          |
| `utils/llms.ts`     | `buildLlmsTxt()`, `buildLlmsFullTxt()`                                         | Bodies of `/llms.txt` and `/llms-full.txt`                                      |
| `utils/feed.ts`     | `buildRssFeed()`                                                               | Body of `/feed.xml`                                                             |
| `data/*.ts`         | Named exports                                                                  | Typed site copy and content; see [DATA_MODEL.md](DATA_MODEL.md)                 |
