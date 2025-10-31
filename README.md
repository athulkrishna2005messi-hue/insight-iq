# InsightHub (MVP)

Monorepo:
- apps/web: Next.js (App Router)
- services/ml: FastAPI microservice

Prerequisites:
- Node 20+, pnpm
- Python 3.11+

Setup:
```bash
pnpm install
pnpm dev
```

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
