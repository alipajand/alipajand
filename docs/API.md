# API reference

The site has one server-side API route. All other pages are statically generated at build time.

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

## Static data APIs (internal)

These are not HTTP endpoints — they are TypeScript modules used at build time.

| Module              | Export                             | Description                                                    |
| ------------------- | ---------------------------------- | -------------------------------------------------------------- |
| `utils/posts.ts`    | `getAllPosts()`, `getPostBySlug()` | Reads Markdown from `content/`, parses gray-matter frontmatter |
| `utils/metadata.ts` | `buildMetadata()`                  | Shared `generateMetadata` helper for all routes                |
| `data/*.ts`         | Named exports                      | Typed static content (experience, skills, education, etc.)     |
