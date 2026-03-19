# Setup Guide

## Summary
Instructions on configuring, installing, and running the Rookies project locally. This document outlines environmental prerequisites, dependency management, and database synchronization.

## System Prerequisites
Ensure you have the following software installed:
- **Node.js** (v18.x or above)
- **PNPM / NPM / YARN** (Based on `package.json` package manager preferences)
- **Docker** (Optional: helpful for locally spinning up isolated databases without a live Supabase project)

## Environment Variables
The application requires specific configurations within a `.env` file stationed at the root level of the folder structure. Create `.env` mirroring the standard templates and input valid configuration bounds:
```env
# Next.js Base Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Config (Used for Client UI)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."

# Firebase Admin (Used for Server Hooks/Route validations)
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."

# Database & Supabase (Used for Prisma connections & API admin rights)
DATABASE_URL="postgres://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" # Prisma string
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Webhook Authentication Secret
ROOKIES_WEBHOOK_SECRET="..."
```
*(Ensure assumptions about exact `.env` naming match standard `Nextjs` implementation expectations if differences are discovered during local spins).*

## Installation Steps
1. **Install Dependencies:**
   Run the following terminal operation to unpack dependencies defined inside `package.json`.
   ```bash
   npm install
   ```
2. **Database Initialization:**
   Update the Database to mirror expected application states. 
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(If making schema migrations, prefer using `npx prisma migrate dev` to track structural modifications).*

3. **Run Application (Development):**
   ```bash
   npm run dev
   ```
   The application now broadcasts locally at `http://localhost:3000`. 
   
## Supabase Setup Notes
Note that the schema and internal rules rely upon multi-tenancy rules and potential backend SQL triggers defined in scripts like `supabase/migrations/001_initial_schema.sql`. Make sure to push foundational Postgres configurations to any empty remote instance first before connecting Prisma directly.