# Major Modules

## Summary
This overview deconstructs the `app/` and `src/` directory concepts into major, logical business domains explicitly showing the directory structure bounds mapping to system functionalities.

## 1. Marketing / Landing Pages (`app/(marketing)`)
- **Responsibility:** Presenting public-facing, SEO-optimized UI to drive visitor conversion. Functions entirely without requiring active HTTP-only session cookies.
- **Components:** Navigational elements defining the product value proposition. Built focusing stringently against performance boundaries keeping dependency footprints highly generalized.

## 2. Authentication Flow (`app/(auth)`)
- **Responsibility:** Securely transitioning users from an anonymous state into authenticated system tenants. Holds Firebase credential validations, identity confirmation logic, and login screen structures (`/sign-in`, `/sign-up`).
- **Setup Onboarding (`/setup`):** An embedded multi-step onboarding funnel rendering complex UI transitions via `framer-motion` requiring a verified user to create fundamental `Business` matrix entities mapping specific preferences (`business type`, `WhatsApp integration keys`) before unlocking dashboard domains entirely. It heavily relies on client-side state engines bridging distinct setup chunks stepmatically.

## 3. Dashboard Interface (`app/(dashboard)`)
- **Responsibility:** The centralized, multi-tenant UI acting as the "Virtual COO" core software bounding users exclusively via middleware validation.
- **Orders (`/orders`):** Dedicated architecture rendering ongoing fulfillment bounds, filtering arrays natively and acting heavily reliant against Server Actions proxy fetches hitting Prisma datasets directly. 
- **Layout Shell:** Produces the overarching application structural container housing navigation links connecting disparate bounded logic trees efficiently maintaining continuous UI elements globally.

## 4. Edge Middleware (`middleware.ts`)
- **Responsibility:** Running natively closest to user request nodes, this file is positioned at the root directory intercepting path execution boundaries strictly seeking valid `__session` HTTP-Cookie components. Modifies request URLs explicitly transferring unverified access mappings dynamically back to `/(auth)` entry routes guaranteeing total encapsulation over any internal logic arrays seamlessly.

## 5. Extensibility API (`app/api`)
- **Responsibility:** Hosting native REST-type endpoints rather than Server Action bindings handling logic external to native UI states organically. 
- **Session Keys (`api/auth/session/route.ts`):** Modifies header boundaries transitioning simple client authentication metrics against Firebase into long-lasting edge-compatible system components internally storing validated identity attributes directly bypassing standardized query nodes.
- **Webhooks (`api/webhooks/n8n/route.ts`):** Ingress mechanism enabling external workflow automation programs to actively parse conversational payloads creating structural changes immediately against internal schema bounding logic tightly holding security symmetric keys stopping invalid structural mutations structurally. 

## 6. Shared Components & Hooks (`components/` & `lib/`)
- **Responsibility:** Containing totally distinct application building blocks abstracting repeating functionalities logically decreasing repository blob sizes organically.
- **UI library:** Standardized visual interfaces mapping forms, specific button behaviors bounding Tailwind operations consistently decreasing UI structural drift constraints.
- **Utility Integrations (`lib/firebase.ts`, `lib/prisma.ts`):** Instantiating singletons linking the node environment back optimally against network heavy dependencies scaling connections logically bypassing initialization overheads repetitively mapping queries rapidly.