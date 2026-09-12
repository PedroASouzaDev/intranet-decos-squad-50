# Intranet do Hospital

Monorepo com `backend/` (FastAPI) e `frontend/` (React + TypeScript). Glossário de domínio em [`CONTEXT.md`](./CONTEXT.md) — leia antes de nomear entidades novas.

## Docs

- [`docs/arquitetura-backend.md`](./docs/arquitetura-backend.md) — stack (FastAPI, SQLAlchemy+Pydantic separados, Postgres, Alembic, MinIO, JWT, pwdlib), organização de módulos, RBAC (dependency vs service), logs.
- [`docs/arquitetura-frontend.md`](./docs/arquitetura-frontend.md) — stack (React+TS, Tailwind, Axios, TanStack Query, React Hook Form, Sonner), estrutura por feature, RBAC no frontend (UX apenas, nunca fonte de verdade), padrão de erro do backend.
- [`docs/convencao-branches-commits.md`](./docs/convencao-branches-commits.md) — branches (`feature/<camada>/<modulo>/<descricao>`), Conventional Commits, fluxo `dev → homolog → main`.

## Regras rápidas

- Autorização real sempre no backend. Checagem no frontend (`ProtectedRoute`, `permissions.ts`) é só UX.
- `admin_setor` opera o dia a dia do próprio setor (avisos, documentos, eventos, ramal). `superadmin` é o único que acessa as páginas de Administração (Usuários, Registro de atividades) e cria setores novos — é um papel de nível sistêmico, não o "admin de conteúdo" mais poderoso.
- Estrutura de módulo/feature é 1:1 entre backend e frontend — mesmo nome dos 7 módulos nos dois lados.

## Convenção de idioma no código

Nomes de arquivos, componentes, funções, variáveis, classes e rotas em **português**, sem acento (ex: `PaginaMural`, `calendario`, `clienteDeConsultas`, `requer_admin`). Isso vale pro código como um todo, frontend e backend.

Exceção: identificadores fixos de bibliotecas/frameworks continuam em inglês, porque não são nossos — imports, hooks (`useState`, `useQuery`), tipos e classes de lib (`QueryClient`, `Route`), nomes de arquivo de convenção da ferramenta (`main.tsx`, `vite.config.ts`). A regra é sobre o que a gente nomeia, não sobre a API externa que a gente consome.
