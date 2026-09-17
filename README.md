# Intranet do Hospital

Monorepo com `backend/` (FastAPI) e `frontend/` (React + TypeScript). Visão geral e convenções em [`CLAUDE.md`](./CLAUDE.md) e [`docs/`](./docs).

## Rodando com Docker

```bash
cp .env.example .env    # troque as senhas e o SEGREDO_JWT
docker compose up -d --build
```

| Serviço | Endereço padrão |
|---|---|
| Frontend (nginx, repassa `/api` ao backend) | http://localhost:8080 |
| Backend (docs interativas em `/docs`) | http://localhost:8000 |
| Postgres | `localhost:5432` |
| MinIO (API / console) | http://localhost:9000 / http://localhost:9001 |

As migrations do Alembic rodam automaticamente quando o backend sobe. Se alguma porta já estiver em uso na sua máquina, ajuste `PORTA_*` no `.env`.

Para desenvolver com hot reload, suba só a infraestrutura e rode backend/frontend localmente:

```bash
docker compose up -d banco armazenamento
```

(ver [`backend/README.md`](./backend/README.md) para o backend).

Comandos úteis:

```bash
docker compose logs -f backend       # acompanhar logs
docker compose up -d --build backend # rebuild após mudar código/dependências
docker compose down                  # parar (dados ficam nos volumes)
docker compose down -v               # parar e apagar banco e arquivos
```
