# Rookies — Virtual COO for Indian Small Businesses

> **Live:** [rookies-apsit.vercel.app](https://rookies-apsit.vercel.app)

A WhatsApp-first AI SaaS platform built with **Next.js 16**, **Clerk**, **Supabase**, **Prisma**, and **TailwindCSS v4**.

Designed for home bakers, kirana stores, Instagram-first brands, and other Indian small businesses to manage orders, payments, inventory, and customer relationships — all from one calm, human-friendly dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router, RSC, Turbopack) |
| Language | TypeScript 5 |
| Styling | TailwindCSS v4 (warm minimal theme) |
| Components | Custom (ShadCN-style) + Lucide Icons |
| Auth | Clerk (`@clerk/nextjs`) |
| Database | Supabase (PostgreSQL with RLS) |
| ORM | Prisma 7 |
| Validation | Zod v4 + React Hook Form |
| Animations | Framer Motion |
| Toasts | Sonner |
| Webhooks | n8n → Supabase |
| Deployment | Vercel + Supabase (free tiers) |

---

## Features

- **Landing Page** — Warm, conversion-focused marketing page with navbar, hero, features, and CTA sections
- **Clerk Authentication** — Sign in / Sign up with Clerk's hosted UI, `UserButton` in dashboard, middleware protection via `clerkMiddleware()`
- **Business DNA Setup** — 4-step animated onboarding flow (`/setup`) with Framer Motion transitions:
  1. Business basics (name, type, city)
  2. Operational details (team size, daily orders, revenue)
  3. Pain points & goals selection
  4. WhatsApp number + preferred language
- **Dashboard** — Sidebar navigation with overview stats, orders, customers, payments, inventory, WhatsApp, and settings sections
- **Orders Screen** — Card-based order display fetched from Supabase with:
  - Customer name & phone
  - Items list (parsed from notes — JSON or plain text)
  - Total in INR (₹)
  - Status badge (Pending / Delivered)
  - Payment badge (Paid / Unpaid)
  - Source badge (WhatsApp)
  - "Mark as Delivered" CTA
  - Friendly empty state
- **n8n Webhook** — `POST /api/webhooks/n8n` receives order data from WhatsApp automation workflows
- **Multi-Tenant Architecture** — All data scoped to `business_id` with Row Level Security

---

## Getting Started

### Prerequisites

- **Node.js** 18.18+ (recommended: 20+)
- **npm** 9+
- A **Clerk** account ([clerk.com](https://clerk.com))
- A **Supabase** account ([supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
git clone https://github.com/vinayak1497/Rookies.git
cd Rookies
npm install
```

### 2. Set Up Clerk

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) and create a new application
2. Copy your **Publishable Key** and **Secret Key** from the API Keys page

### 3. Set Up Supabase

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings → Database** and copy the connection string → `DATABASE_URL`
4. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`

### 4. Configure Environment

Create `.env.local` in the project root:

```bash
# ─── Clerk ───
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/setup

# ─── Supabase ───
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── Database (Prisma) ───
DATABASE_URL=your-database-connection-string

# ─── App ───
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
├── app/
│   ├── layout.tsx                  # Root layout (ClerkProvider, fonts, Toaster)
│   ├── globals.css                 # TailwindCSS v4 theme (warm orange palette)
│   ├── (marketing)/                # Landing page (public)
│   │   ├── layout.tsx              # Navbar + Footer
│   │   └── page.tsx                # Hero + Features + CTA
│   ├── (auth)/                     # Auth pages
│   │   ├── layout.tsx              # Centered card layout with logo
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/page.tsx   # Clerk <SignIn /> component
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/page.tsx   # Clerk <SignUp /> component
│   │   └── setup/                  # Business DNA onboarding (4 steps)
│   │       ├── page.tsx            # Orchestrator with AnimatePresence
│   │       ├── schema.ts           # Zod validation + constants
│   │       └── _components/        # Step forms + shared UI
│   ├── (dashboard)/                # Protected dashboard
│   │   ├── layout.tsx              # Sidebar + Topbar + Clerk UserButton
│   │   └── dashboard/
│   │       ├── page.tsx            # Overview (stats cards)
│   │       └── orders/
│   │           ├── page.tsx        # Orders server component
│   │           ├── orders-list.tsx # Client card grid + empty state
│   │           └── actions.ts      # Server actions (fetch, mark delivered)
│   ├── api/
│   │   ├── health/route.ts         # Health check endpoint
│   │   ├── assistant/route.ts      # AI assistant (future)
│   │   └── webhooks/n8n/route.ts   # n8n webhook receiver
│   └── auth/
│       └── callback/route.ts       # Email confirmation callback
├── components/
│   ├── ui/                         # Button, Card, Input, Dialog
│   ├── layout/                     # Navbar, Footer, Container, SectionWrapper
│   └── forms/                      # FormInput (reusable)
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client + admin client
│   ├── auth.ts                     # Auth helper functions
│   └── utils.ts                    # cn(), formatINR(), getInitials()
├── types/
│   ├── database.ts                 # TypeScript types (mirrors Prisma schema)
│   └── index.ts                    # Re-exports
├── prisma/
│   └── schema.prisma               # Multi-tenant schema (8 models)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Full SQL schema + RLS policies
├── proxy.ts                        # Clerk middleware (clerkMiddleware())
├── .env.local                      # Secrets (git-ignored)
└── package.json
```

---

## Database Schema

Multi-tenant architecture — every record is scoped to a `business_id`:

| Table | Purpose |
|-------|---------|
| `businesses` | Company profiles (name, type, city, GST, logo) |
| `business_members` | Users ↔ Businesses junction (roles: owner, admin, staff, viewer) |
| `orders` | Order tracking with status, source, delivery date |
| `customers` | Customer CRM (name, phone, email, address) |
| `payments` | UPI, cash, bank transfers, card payments |
| `inventory_items` | Stock management with low-stock alerts |
| `activity_logs` | Audit trail for all business actions |

All tables have **Row Level Security (RLS)** enabled via a `get_user_business_ids()` helper function. Users can only access data for businesses they belong to.

---

## Authentication Flow

```
Landing Page → Sign Up (Clerk) → Business DNA Setup (/setup) → Dashboard
                 ↕
             Sign In (Clerk) → Dashboard
```

- **Clerk** handles all authentication (sign in, sign up, session management)
- `clerkMiddleware()` in `proxy.ts` protects routes
- `<ClerkProvider>` wraps the app in the root layout
- `<UserButton>` in the dashboard sidebar and top bar for account management
- After sign-up → redirected to `/setup` (Business DNA onboarding)
- After sign-in → redirected to `/dashboard`
- Navbar shows `SignedIn` / `SignedOut` states with appropriate buttons

---

## Orders Flow

```
WhatsApp Customer → n8n Workflow → POST /api/webhooks/n8n → Supabase (orders table)
                                                                 ↓
                              Dashboard Orders Screen ← Server Action (fetch)
                                                                 ↓
                              "Mark as Delivered" → Server Action (update status)
```

The orders page uses Clerk's `auth()` to identify the user, looks up their `business_id` via `business_members`, then fetches orders with joined customer and payment data from Supabase, sorted by `created_at DESC`.

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check — returns system status |
| `/api/webhooks/n8n` | POST | Receives order data from n8n WhatsApp workflows |
| `/api/assistant` | POST | AI assistant endpoint (future) |

---

## Design System

Warm minimal UI with an India-first personality:

| Token | Value |
|-------|-------|
| Primary | `#ec5b13` (warm orange) |
| Background | `#faf8f5` (warm off-white) |
| Clay | `#1a1a1a` (dark text) |
| Peach Soft | `#fdf2ec` (soft highlight) |
| Font (body) | Inter |
| Font (headings) | Playfair Display |

Key principles: soft rounded cards, neutral backgrounds, one strong CTA per card, human language, calm tone, no charts.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` → `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` → `/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` → `/dashboard`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` → `/setup`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
4. Deploy — builds with Turbopack

### Custom Domain (Optional)

1. Add your domain in Vercel project settings
2. Point DNS (Cloudflare or registrar):
   - CNAME `@` → `cname.vercel-dns.com`
   - CNAME `www` → `cname.vercel-dns.com`

---

## Development Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Landing page | ✅ Done |
| 2 | Clerk authentication | ✅ Done |
| 3 | Business DNA onboarding (4-step setup) | ✅ Done |
| 4 | Dashboard layout shell | ✅ Done |
| 5 | Orders module (display + mark delivered) | ✅ Done |
| 6 | n8n webhook endpoint | ✅ Stub ready |
| 7 | WhatsApp integration | 🔲 Planned |
| 8 | Payment tracking | 🔲 Schema ready |
| 9 | Inventory management | 🔲 Schema ready |
| 10 | Customer CRM | 🔲 Schema ready |
| 11 | AI assistant | 🔲 API stub ready |

---

## Commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## Contributing

This is a private project. For access or collaboration, contact the maintainer.

## License

Private — All rights reserved.
