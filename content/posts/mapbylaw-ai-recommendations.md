---
title: "Teaching MapBylaw to give honest AI recommendations"
date: "2026-02-26"
excerpt: "How we went from vague, ChatGPT-flavoured suggestions to grounded, auditable AI recommendations inside a real zoning and feasibility product."
---

On MapBylaw, “AI recommendations” can’t just sound smart — they have to survive contact with a real planner, a skeptical developer, and a 10‑page report. If the text isn’t grounded in zoning rules, feasibility math, and the same datasets the rest of the app uses, it’s just copy with a chatbot accent.

This is how I went from “ChatGPT-flavoured suggestions” to recommendations that are specific, auditable, and aligned with our own report content policy.

**Problem — Vague advice and no guardrails.**  
Early experiments produced generic text like “consider adding more units” or “optimize density where possible.” It didn’t reference the actual parcel, PUM 2050 sector, heritage constraints, or the report content policy we’d already written (“no static or fake data, no region-hardcoded fallbacks that pretend to be real”).  

On top of that, there was no clear contract between the Fastify API, the React dashboards, and the React‑PDF report. The AI could “see” some combination of fields, but there was no easy way for us to prove which ones or to enforce that the dashboard and PDF were looking at the same payload. Auditing a recommendation meant chasing it through multiple layers of code.

**Solution — Type the pipeline and narrow the context.**  
The turning point was treating AI recommendations as just another typed service in the architecture instead of a black box bolted on the side.

- Defined a **strict TypeScript shape** for `ai_recommendations` in the API and database, and consumed that in both the web dashboard and PDF payload builder.  
- Built a **narrow context builder** that only feeds the model what we already know is true: zoning code, PUM 2050 sector, heritage/climate flags, feasibility scores, and the development scenarios we’ve actually computed. Nothing else.  
- Wired the flow into **OpenAPI + Zod** so every field is validated before it can hit the UI or the report, and added tests so a missing or malformed recommendation fails fast instead of silently rendering nonsense.  
- Aligned the copy with our **reports data audit and content policy**: no invented numbers, no synthetic fallbacks masquerading as real data, no hardcoded Montreal details in places that should be configurable, and explicit “data not available” messages when upstream data is missing.

**Result — Grounded, auditable guidance.**  
Recommendations are now specific (“Scenario B exceeds the Plateau conversion cap; keep gross floor area under 200 m² or switch to a plex + ADU strategy”) and consistent across the dashboard and PDF, because they flow through the same typed payload.

When we ship a new rule (like rental stock protection, eco‑district incentives, or updated risk categories), we update the orchestrator and types once. The AI layer automatically gets better context and stricter validation without anyone hand‑editing copy.  

The practical effect is simple: users get advice that feels like it comes from MapBylaw — with the same constraints, data sources, and caveats as the rest of the product — instead of from a detached chatbot you happen to have embedded on the side.

