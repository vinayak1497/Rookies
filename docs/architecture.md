# System Architecture

## Summary
The Rookies platform utilizes a modern Full-Stack monolith built around Next.js, relying extensively on server-side rendering (SSR), edge middleware, and external SaaS providers (Firebase for Auth, Supabase for Database, n8n for automations). It favors modularization by grouping components strictly to their business domains under an App Router schema.

## High-Level Components
1. **Client Layer (Browser):**
   - Renders React 18+ components using Next.js App Router patterns `(auth)`, `(dashboard)`, and `(marketing)`.
   - Reaches out to Firebase natively to grab user ID payloads before passing them to internal session engines.

2. **Application Server (Next.js Node/Edge Environment):**
   - Validates user security properties upon ingress using `middleware.ts`.
   - Interacts heavily with `zod` schema to guarantee runtime validation before modifying DB states.
   - Hosts strictly isolated server actions (`actions.ts`) acting as proxies to write or pull operational data without exposing logic client-side.

3. **Database Layer (Supabase Postgres & Prisma):**
   - Houses the canonical truth records governed strictly by `business_id` bindings forming a multi-tenant matrix.
   - Synchronized utilizing Prisma queries inside the Node environment primarily.
   - Allows direct administrative extraction using Supabase Administrative keys mapping securely inside `lib/supabase/server.ts` or routes when bypassing standard ORM flows are beneficial. 

4. **Integration Engine (n8n Webhooks):**
   - Third-party automation services (like n8n) funnel unstructured data sets (WhatsApp queries) and push organized payloads.
   - Strikes an endpoint at `/api/webhooks/n8n/route.ts` validating tokens and mutating internal schemas matching automated inputs to live dashboard outputs silently.

## Data Flow (WhatsApp Automations Example)
```text
[ Customer WhatsApp Chat ] 
       ↓ 
[ Meta WhatsApp API ] 
       ↓
[ n8n Workflow Engine (Information Parser) ] 
       ↓ HTTP POST (Payload + `x-rookies-secret` Header)
[ Rookies /api/webhooks/n8n Endpoint ]
       ↓ Validates Secret & Zod Schema
[ Prisma DB Write (New Order / New Lead) ] 
       ↓
[ Next.js React UI updates via Dashboard APIs ]
```

## Security Posture Flow
```text
[ Browser (Firebase Auth Request) ] -> Returns Identity Token → [ Next.js UI ] 
        ↓ 
[ Next.js API (/api/auth/session) ] -> Validates mapping against Firebase Admin
        ↓
[ Success ] -> Writes secure HTTP `__session` Cookie. 
        ↓
[ Middleware.ts edge validator guards protected domains against missing cookies ]
```