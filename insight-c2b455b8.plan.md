<!-- c2b455b8-624e-4eb0-9c21-6cf246e67168 97de3167-3713-48ec-a8a3-e829c8b9f7f8 -->
# InsightHub MVP (Mock-first) — Build Plan

### Goal

Ship a working MVP (frontend + backend + ML microservice) using mocked Whop data, matching the PDFs’ requirements. After MVP validation, flip mocks to Whop SDK/webhooks with minimal refactor.

### Architecture

- **Frontend**: Next.js (App Router) + TypeScript, Tailwind CSS, FrostedUI.
- **Backend**: Next.js API routes (Node/TS). Mock repositories first, then PostgreSQL via Prisma.
- **DB**: PostgreSQL (Prisma schema), Redis optional later (cache).
- **ML**: Python (FastAPI) microservice for churn scoring; start with logistic regression + SHAP-like explanations.
- **Auth**: Mock Whop OAuth/session. Gate by `companyId` header/query. Later: Whop SDK `app()` and OAuth.
- **Observability**: Sentry (frontend/backend), basic logging. Vercel logs.

### Repository Structure

- `apps/web/` (Next.js app)
- `app/(dashboard)/dashboard/[companyId]/page.tsx`
- `app/(members)/members/[companyId]/page.tsx`
- `app/members/[companyId]/[memberId]/page.tsx`
- `app/cohorts/[companyId]/page.tsx`
- `app/alerts/[companyId]/page.tsx`
- `app/settings/[companyId]/page.tsx`
- `app/api/*` (API routes listed below)
- `components/*` (KPI, charts, tables, forms)
- `lib/mock/*` (mock data generators, repositories)
- `lib/auth/*` (mock auth; later Whop)
- `styles/*`
- `packages/ui/` (optional shared components)
- `services/ml/` (FastAPI churn model)
- `main.py`, `train.py`, `model.pkl`, `requirements.txt`, `tests/`
- `prisma/schema.prisma` (start schema; keep mocks as default provider)
- `tests/` (jest + supertest + playwright)
- `.github/workflows/ci.yml`
- `docs/` (openapi.yaml/postman, deploy.md, demo_script.md, store_listing.md)

### Data Model (Prisma outline)

- `Company(companyId, name, timezone, plan, createdAt)`
- `Member(memberId, companyId, email, displayName, joinDate, lastActiveAt, lifetimeValue, planIds JSON, engagementScore, riskScore)`
- `Event(eventId, memberId, companyId, type, metadata JSON, occurredAt)`
- `Cohort(cohortId, companyId, name, filterDefinition JSON, createdAt)`
- `Alert(alertId, companyId, ruleDefinition JSON, lastTriggeredAt)`

Start with in-memory/mock repositories and seed JSON. Enable Prisma later via env switch.

### API Contract (MVP, mocked data)

- `GET /api/dashboard/:companyId` → KPIs + time series.
- `GET /api/members/:companyId` → paginated list + filters: `q`, `cohortId`, `riskMin`, `riskMax`.
- `GET /api/members/:companyId/:memberId` → detail.
- `POST /api/cohorts/:companyId` → create; body: `name`, `filterDefinition`.
- `GET /api/cohorts/:companyId` → list + retention series.
- `GET /api/alerts/:companyId` → list.
- `POST /api/alerts/:companyId/trigger` → simulate action (log/mock DM).
- `GET /api/risk/:companyId` → ranked at-risk members.
- `POST /api/webhooks/whop` → mocked receiver; validate with shared secret; store to `Event`.

OpenAPI spec in `docs/openapi.yaml`; Postman collection exported.

### Mock Strategy (swap-ready)

- `lib/mock/datasource.ts`: seed companies, members, payments, messages, events.
- `lib/data/repositories`: interface-based repos. Implement `Mock*Repository`; later add `Prisma*Repository`.
- `lib/auth/session.ts`: mock session with `companyId` + `role`; later plug Whop SDK.
- Feature flags via env: `DATA_PROVIDER=mock|prisma`.

### Frontend Pages & UI

- Dashboard: KPI tiles (Active, New 7/30/90d, Churn 7/30/90d, MRR, ARPU, Minutes), time series charts (members, revenue, engagement).
- Members: searchable table, filters, risk badges, cohort tags.
- Member Detail: profile, plans, activity timeline, purchases, messages, trigger re-engagement (mock action modal).
- Cohorts: builder (form for join date, promo code, behaviors), retention chart.
- Alerts: list, create/edit rule (drop > X OR risk > Y), test trigger button.
- Settings: anonymization toggle, API keys placeholders.

### Churn Predictor (services/ml)

- `train.py`: feature engineering (7/30/90d): minutes, sessions, days active, lastActiveDaysAgo, purchases90d, arpu, messages, contentCount, cohort one-hot.
- Model: logistic regression baseline; save `model.pkl`.
- API `POST /score`: body list of member feature dicts → returns `[ {memberId, riskScore, reasons: ["...", ...]} ]`.
- Explanations: coefficient-driven top-3 factors (signed impact).
- `ml_client` in web backend calls the service; fallback to heuristic scorer when ML service disabled.

### Security & Multi-tenant

- Require `companyId` match between session and route.
- Anonymization toggle masks emails/display names in UI.
- Role check: `admin` only for cohorts/alerts.

### Observability

- Sentry DSN wiring; safe PII scrubbing middleware for logs.

### Testing

- Backend unit tests (repositories, KPI aggregations).
- Integration tests (supertest) for each API endpoint (mock data).
- ML unit tests: training runs, ROC AUC on sample dataset, precision@k.
- E2E: Playwright script: “install” (mock), view dashboard, flag risk, trigger re-engagement.

### CI/CD

- GitHub Actions: Node 20 + pnpm, lint, typecheck, tests; Python job for ML tests. On main: deploy to Vercel (preview on PR).
- `deploy.md`: Vercel setup, env vars; ML service deploy on Railway/Render.

### Deployment

- Frontend/backend: Vercel.
- ML: Railway/Render free tier; expose `/score` + `/health`.

### Docs & Assets

- `README.md`: setup, env, commands (`pnpm dev`, `pnpm test`, `python train.py`).
- `docs/openapi.yaml` + Postman.
- `docs/demo_script.md`: 30s script.
- `docs/store_listing.md`: icon guidance, 3 screenshots, tagline, 200-word description.
- `public/mockups/*.png`: 3 lightweight screens.

### Milestones (timeboxed)

- M1 (48h): Repo skeleton, mock auth, webhook receiver (mock), stubbed dashboard endpoints with sample data.
- M2 (48h): Members API + UI list + member detail; charts wired to mocks.
- M3 (72h): Cohort builder + retention chart; webhook event persistence into mock store.
- M4 (72h): ML service baseline + `/api/risk` integration; risk badges in UI.
- M5 (48h): Alerts demo automation, tests, CI, deployment, docs, demo assets.

### Risks & Mitigations

- Chart performance on large mocks → paginate and virtualize lists; sample down series.
- ML service cold starts → heuristic fallback; cache risk scores.
- Swap to Whop SDK → repository interfaces minimize surface area.

### To-dos

- [ ] Initialize monorepo with Next.js app and ML service skeleton
- [ ] Implement mock datasource, repositories, and seed generator
- [ ] Add mock auth/session and company role gating
- [ ] Create API routes returning stubbed dashboard metrics/time series
- [ ] Build dashboard KPIs and charts wired to API
- [ ] Implement members list/detail endpoints with filters
- [ ] Create members table and detail view with actions
- [ ] Add cohorts create/list and retention calculations
- [ ] Build cohort builder UI and retention chart
- [ ] Implement webhook receiver and persist events to mock store
- [ ] Implement churn training and scoring FastAPI service
- [ ] Wire /api/risk to ML (with heuristic fallback)
- [ ] Implement alerts rules and demo trigger endpoint
- [ ] Build alerts page with rule form and test trigger
- [ ] Write unit/integration tests and Playwright E2E
- [ ] Add GitHub Actions for lint/test/deploy to Vercel
- [ ] Write README, deploy.md, OpenAPI, demo script, store listing, screenshots