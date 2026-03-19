# Security & Risk Management

## Summary
This document outlines the security practices, authentication mechanisms, and potential risks identified within the Rookies application architecture. A multi-layer approach ensures data privacy and structural integrity.

## Authentication Mechanism
- **Provider:** Firebase Authentication initially sets up identity and returns short-lived ID tokens to the Front-End client upon authentication.
- **Session Management:** Over an explicit endpoint (`/api/auth/session`), the ID token is validated by the `firebase-admin` SDK. Upon successful verification, an HTTP-only secure cookie (`__session`) is created and bound to the user's active session, expiring generally in 5 days.
- **Identity Sync:** While Firebase asserts identities, the user data is concurrently upserted to a `Users` table acting as the primary system-of-record in PostgreSQL, mapping via `firebase_uid`.

## Authorization & RLS Controls
- **Edge Middleware:** The Next.js `middleware.ts` runs on edge networks evaluating the HTTP-only `__session` cookie. Untethered access to protected domains like `/(dashboard)` and `/(auth)/setup` strictly redirects the traffic back to login templates.
- **Supabase RLS (Row Level Security):** Data boundaries rely primarily on PostgreSQL's RLS parameters handled via Supabase bindings. The system employs a **Multi-Tenant Setup**; interactions are strictly clamped using the `business_id` scoping to verify user rights natively in the Database. 
- **RBAC:** Within businesses, users engage functionally using specific bounded roles mapped in `BusinessMember` attributes such as `owner`, `admin`, `staff`, or `viewer`.

## Webhook Verification Mechanisms
To shield external ingress endpoints (`api/webhooks/n8n/route.ts`), Rookies enforces a secret token verification flow:
- Incoming requests must emit an arbitrary header match: `x-rookies-secret`. 
- The payload undergoes string verification against the server-side environment (`process.env.ROOKIES_WEBHOOK_SECRET`). Only verified signatures proceed. 

## Known Risks & Mitigation
| Risk | Assessment | Mitigation Strategy |
| -- | -- | -- |
| Firebase vs. PostgreSQL Drift | A disparity between auth entries | Maintain rigorous synchronization within `/api/auth/session` upserts. Run daily health scripts to evaluate mismatches. |
| Webhook Forgery | A payload spoof bypassing N8N channels | Enforce strict symmetric key configurations (`ROOKIES_WEBHOOK_SECRET`) and rate limit ingress nodes tightly. Use IP whitelisting if possible. |
| RLS Bypass via Service Role | `lib/supabase/client.ts` bleeding service environments | Only deploy Supabase 'admin/service' rolls strictly inside server actions or route handlers ensuring UI bindings exclusively leverage Anon/Public variants. |
