# InsightHub (MVP)

Monorepo:
- apps/web: Next.js (App Router)
- services/ml: FastAPI microservice

Prerequisites:
- Node 20+, pnpm
- Python 3.11+

Setup:
```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your actual Whop credentials

# 3. Start development servers
pnpm dev
```

### Environment Variables
Copy `.env.example` to `.env.local` and configure:

- `WHOP_SECRET` - Webhook secret from your Whop app dashboard (validates incoming webhooks)
- `WHOP_PUBLIC_KEY` - Public key for client-side Whop SDK (if needed)
- `NEXT_PUBLIC_WHOP_ENV` - Environment mode: `development` or `production`
- `ML_BASE_URL` - URL for the ML service (default: `http://localhost:8000`)

**Important:** Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Server-side secrets like `WHOP_SECRET` remain private.

For CI/CD or hosting providers, add the same values as project secrets (e.g., GitHub Secrets `WHOP_SECRET`, `WHOP_PUBLIC_KEY`, `NEXT_PUBLIC_WHOP_ENV`, `ML_BASE_URL`) so workflows and deployments have access to them.

### Frontend styling (Tailwind + shadcn/ui)
- Tailwind CSS is configured for the web app in `apps/web/tailwind.config.js` with global styles defined in `apps/web/app/globals.css`.
- Generate additional shadcn/ui components with `pnpm --filter apps/web dlx shadcn@latest add <component>`.
- When creating new UI primitives, place them under `apps/web/components/ui` to ensure Tailwind scans them.

ML service:
```bash
cd services/ml
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
python main.py
```

Notes:
- Send `x-company-id` header (defaults to `demo-company`).
- Plan: see `insight-c2b455b8.plan.md`.

## API Docs (OpenAPI)
Spec: `docs/openapi.yaml`

Preview with Swagger UI (Docker):
```bash
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/spec/openapi.yaml \
  -v "${PWD}/docs:/spec" \
  swaggerapi/swagger-ui
# open http://localhost:8080
```

Preview with Redocly CLI (no install via npx):
```bash
npx -y @redocly/cli preview-docs docs/openapi.yaml --port 8081
# open http://localhost:8081
```

## Postman
Collection: `docs/postman/insighthub.postman_collection.json`

Import into Postman, then set variables:
- baseUrl: `http://localhost:3000`
- companyId: `demo-company`
- memberId: e.g. `m1`
- role: `admin`
- whopSecret: `dev-secret`
