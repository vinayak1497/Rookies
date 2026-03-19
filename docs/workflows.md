# Workflow & Guidelines

## Summary
General developmental principles defining how code is modified, tested, and structurally deployed within the Rookies Next.js ecosystem organically handling multi-tenant constraints cleanly.

## CI/CD Pipelines
At this phase, automatic verifications predominantly focus upon:
- **Build Checks:** Validating type definitions globally (i.e. `tsc --noEmit`).
- **Linter Gates:** Standard validations mapping `eslint` enforcing logic structures.
- **Database Migrations:** Running integration actions ensuring new Postgres objects mapped via `schema.prisma` initialize without destructive cascades against standard multi-tenant RLS configurations intrinsically.

## Development Workflow
1. **Local Setup:** Developers clone repos running basic package initialization (`npm install`).
2. **Environment Variables:** Must strictly align matching specific remote configurations bounding database connectivity keys locally via `.env` arrays mapping closely.
3. **Database Spin-up:** Must align `schema.prisma` boundaries by executing a structural initialization sync: `npx prisma db push` linking local environments optimally. 
4. **Development Scripting:** `npm run dev` operates utilizing hot module replacements mapping internal Next.js node systems optimally.

## Feature Implementation Patterns
When adding new functionality bounds:
1. **Schema Mutations (`prisma/schema.prisma`):**
   - Alter strictly accounting against the multi-tenant `business_id` logic keeping security boundaries intact initially. Generate updates safely utilizing `npx prisma generate`.
2. **Server Actions vs REST Endpoints:**
   - Default structurally directly creating functions within bound `actions.ts` files operating nearest logical components bypassing heavy HTTP-routing overhead natively inside Next.js arrays.
   - Utilize `/api/` mappings structurally solely when third-party components (n8n Webhooks, standard app hooks) dictate necessity structurally explicitly relying upon decoupled external systems.
3. **Validation Arrays:** Ensure all UI inputs mutate structurally heavily verified using `Zod` definitions verifying properties structurally bounding logic tightly minimizing downstream database error states natively validating immediately via UI bindings cleanly.

## Prisma Best Practices
- **Singleton Binding:** Utilize `lib/prisma.ts` exported clients exclusively across application modules maintaining connection pooling states optimally checking existing initialized global bounds seamlessly bypassing redundant initializations actively.