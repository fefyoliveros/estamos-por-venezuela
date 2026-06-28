# estamos-por-venezuela — Project Rules

## Stack
- Next.js 14 (App Router), TypeScript strict, Tailwind CSS
- Supabase (PostgreSQL + RLS + Auth for admin only)
- Gemini 1.5 Flash API (questionnaire routing + submission verification)
- Vercel deployment — domain: estamosporvenezuela.com
- i18n: React Context (Spanish primary, English toggle)

## Principles
- @rules/security.md
- @rules/git.md
- Type safety: no `any`. Enable strict mode.
- RLS enabled on every Supabase table.
- Gemini key only accessed server-side (API routes), never in client bundle.
- Admin auth via Supabase Auth (email + password). No custom auth.
- Spanish-first: all UI strings go through the translation context.

## File Layout
```
app/
  (public)/          # all public routes
    page.tsx         # home
    directorio/      # searchable resource directory
    asistente/       # AI guided questionnaire
    necesito-ayuda/  # help request form + list
    agregar/         # submit new resource
  (admin)/           # admin routes
    admin/
      page.tsx       # login
      dashboard/     # manage submissions + help requests
  api/
    resources/
    submissions/
    help-requests/
    ai/
      route.ts       # Gemini questionnaire
      verify/route.ts # Gemini submission verification
    admin/
components/          # shared UI
lib/
  supabase/
    client.ts        # browser client
    server.ts        # server client
  gemini.ts          # Gemini SDK wrapper (server-only)
  translations.ts    # ES/EN string map
  types.ts           # shared TypeScript types
supabase/
  migrations/        # SQL migration files
```

## Agent Overrides
- researcher: verify NGO URLs before including. Min 2 sources per claim.
- backend-builder: enable RLS immediately after CREATE TABLE. No exceptions.
- frontend-builder: use translations context for every visible string. No hardcoded text.
- reviewer: flag any Gemini key usage outside /api/ routes as CRITICAL.
