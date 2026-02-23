# Rookies — Virtual COO for Indian Small Businesses

A production-ready SaaS foundation built with **Next.js 16**, **Supabase**, **Prisma**, and **TailwindCSS v4**.

Designed for home bakers, kirana stores, Instagram-first brands, and other Indian small businesses.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript 5 |
| Styling | TailwindCSS v4 |
| Components | Custom (ShadCN-style) + Lucide Icons |
| Auth | Supabase Auth (Email + Phone OTP) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Validation | Zod + React Hook Form |
| Toasts | Sonner |
| Deployment | Vercel + Supabase (free tiers) |

---

## Getting Started

### Prerequisites

- **Node.js** 18.18+ (recommended: 20+)
- **npm** 9+
- A **Supabase** account ([supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Rookies
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings → Database** and copy the connection string → `DATABASE_URL`
4. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
├── app/
│   ├── (marketing)/          # Landing page (public)
│   │   ├── layout.tsx        # Navbar + Footer
│   │   └── page.tsx          # Hero + Features + CTA
│   ├── (auth)/               # Auth pages
│   │   ├── layout.tsx        # Centered card layout
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (dashboard)/          # Protected dashboard
│   │   ├── layout.tsx        # Sidebar + Topbar
│   │   └── dashboard/page.tsx
│   ├── api/
│   │   ├── health/route.ts
│   │   ├── assistant/route.ts
│   │   └── webhooks/n8n/route.ts
│   ├── globals.css
│   └── layout.tsx            # Root layout (fonts, toaster)
├── components/
│   ├── ui/                   # Button, Card, Input, Dialog
│   ├── layout/               # Navbar, Footer, Container, SectionWrapper
│   └── forms/                # FormInput
├── lib/
│   ├── supabase/             # Client, Server, Middleware clients
│   ├── auth.ts               # Auth helper functions
│   └── utils.ts              # cn(), formatINR(), getInitials()
├── types/
│   ├── database.ts           # TypeScript types
│   └── index.ts
├── prisma/
│   └── schema.prisma         # Multi-tenant schema (8 models)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # SQL + RLS policies
├── middleware.ts              # Route protection
├── .env.example
└── .env.local                # Your secrets (git-ignored)
```

---

## Database Schema

Multi-tenant architecture — every record is scoped to a `business_id`:

- **businesses** — Company profiles
- **business_members** — Users ↔ Businesses (roles: owner, admin, staff, viewer)
- **orders** — Order tracking with status and source
- **customers** — Customer CRM
- **payments** — UPI, cash, bank transfers
- **inventory_items** — Stock management with low-stock alerts
- **activity_logs** — Audit trail

All tables have **Row Level Security (RLS)** enabled. Users can only access data for businesses they belong to.

---

## Authentication

- **Email + Password** sign in/up
- **Phone + OTP** (India-first, via Supabase)
- **Middleware** protects `/dashboard/*` routes
- Unauthenticated users are redirected to `/sign-in`
- Authenticated users on auth pages are redirected to `/dashboard`

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/webhooks/n8n` | POST | n8n workflow webhooks |
| `/api/assistant` | POST | AI assistant (future) |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
4. Deploy

### Cloudflare DNS (Optional)

1. Add your domain to Cloudflare
2. Point DNS to Vercel:
   - CNAME `@` → `cname.vercel-dns.com`
   - CNAME `www` → `cname.vercel-dns.com`
3. Add the domain in Vercel project settings

---

## Development Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Landing page | ✅ Done |
| 2 | Authentication | 🔲 Skeleton ready |
| 3 | Business onboarding | 🔲 Schema ready |
| 4 | Dashboard layout shell | ✅ Done |
| 5 | Orders module | 🔲 Schema ready |
| 6 | WhatsApp integration | 🔲 Webhook stub ready |
| 7 | Payment tracking | 🔲 Schema ready |
| 8 | Inventory management | 🔲 Schema ready |
| 9 | AI assistant | 🔲 API stub ready |

---

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## License

Private — All rights reserved.
