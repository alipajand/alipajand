# Contact form rate limit

`POST /api/contact` sends an email for every valid request, so it is rate limited at the edge by a Vercel Firewall custom rule. The rule is project configuration in Vercel, not code in this repository, so it does not change with a deploy and has to be checked in the Vercel dashboard (Firewall → Rules) or with the Vercel CLI or API.

## Rule

| Field     | Value                                               |
| --------- | --------------------------------------------------- |
| Name      | `Contact form rate limit`                           |
| Condition | path equals `/api/contact` AND method equals `POST` |
| Action    | rate limit, fixed window                            |
| Window    | 600 seconds                                         |
| Limit     | 5 requests                                          |
| Key       | client IP                                           |
| Exceeded  | `429 Too Many Requests`                             |

Same rule with the Vercel CLI:

```bash
vercel firewall rules add "Contact form rate limit" \
  --condition '{"type":"path","op":"eq","value":"/api/contact"}' \
  --condition '{"type":"method","op":"eq","value":"POST"}' \
  --action rate_limit \
  --rate-limit-window 600 \
  --rate-limit-requests 5 \
  --rate-limit-keys ip \
  --rate-limit-action rate_limit
```

Why these numbers: a real visitor sends one message, maybe a corrected second one. Five per ten minutes leaves room for retries after validation errors and for a few people behind one shared network (an office or a conference Wi-Fi), while capping how many emails one client can trigger. Requests rejected by the handler (`400`, `413`, `415`) still count, because the firewall runs before the handler.

Why not in code: functions on Fluid Compute share instances unpredictably, so an in-memory counter would not hold across instances, and a shared store would add a dependency for one form.

## Client behaviour

The firewall's `429` body is not JSON. `useContactForm` checks the status and shows `CONTACT_FORM_ERROR_RATE_LIMITED` from `data/contactForm.ts`, which points to the email address as a fallback.

## Verify

Against a preview deployment, not production:

```bash
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST "$PREVIEW_URL/api/contact" \
    -H "content-type: application/json" --data '{}'
done
```

Expect five `400` responses and then `429`. The empty body is rejected by the handler, so no email is sent. Then check in the Firewall dashboard that the rule logged the hits.

## If abuse continues

Add a honeypot field to the form only if edge rate limiting proves insufficient. Lowering the limit or switching the exceeded action to `challenge` are the next options before any code change.
