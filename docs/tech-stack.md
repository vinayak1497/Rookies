# Tech Stack

## Summary
The primary technologies, languages, and frameworks comprising the Rookies codebase. The stack emphasizes type-safety, robust component reusability, and modern SaaS infrastructure tools.

## Core Language & Framework
| Technology | Role | Details |
| -- | -- | -- |
| **TypeScript (v5.x)** | Primary Language | Enforces strict type compliance across UI bindings and server hooks limiting structural deployment drift issues. |
| **Next.js (v16.1.6)** | Application Framework | Employs the `App Router` (`app/` directory). Serves as both the UI renderer via SSR components and holds the server functions handling API endpoints and server actions. |
| **React (v18+)** | Component Library | Renders complex interactive DOM structures tracking UI lifecycle environments natively tied to Next.js patterns. |

## Styling & Animations
| Technology | Role | Details |
| -- | -- | -- |
| **Tailwind CSS (v4)** | CSS Utility Framework | Eliminates standard CSS blobs, applying atomic class naming natively pushing quick styling modifications over component scopes. |
| **Framer Motion** | Animation Library | Utilized during complex transition bounds handling smooth layout operations inside the `(auth)/setup` components and dashboard flows. |
| **Lucide React** | Iconography | Component-wrapped vector graphics reducing image bundle size while maintaining high UI consistency constraints. |

## Backend & Database
| Technology | Role | Details |
| -- | -- | -- |
| **PostgreSQL (Supabase)** | Core Relational Database | Maintains core platform states. Extensively relies internally upon the Row Level Security principles binding user operations securely. |
| **Prisma ORM** | Object-Relational Mapping | Strongly-types Postgres querying via `schema.prisma`. Handles query executions dynamically ensuring server functions align strictly against database architectural contracts. |
| **Supabase SDKs** | Specialized Queries | While Prisma dominates relations, raw Supabase keys hit direct API hooks (`@supabase/ssr`, `@supabase/supabase-js`) for administrative data dumps or specific RLS triggers bypassing standard flows organically. |

## Authentication & Security
| Technology | Role | Details |
| -- | -- | -- |
| **Firebase Auth** | Primary IDP | Initially gathers credentials (Email, Phone) generating a standard JWT pattern payload via `@firebase/app` logic trees mapping identity structures securely before offloading sessions over edge functions mappings. |
| **Zod** | Schema Validation | Evaluates unknown ingress objects against explicit structural requirements (UI forms or Webhooks) terminating malformed data bounds rapidly preventing server crashes. 

## Build & Dependencies
| Technology | Role | Details |
| -- | -- | -- |
| **ESLint / Prettier** | Linter & Formatting | Automates syntax formatting against standardized configurations holding structural code uniform across components implicitly via `eslint.config.mjs`. |