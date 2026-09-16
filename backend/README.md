# Backend — Intranet do Hospital

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # ajuste URL_BANCO e SEGREDO_JWT

alembic upgrade head
uvicorn app.main:app --reload
```

- Healthcheck: `GET /saude` (503 se o banco estiver fora).
- Documentação interativa: `http://localhost:8000/docs`.
- Nova migration: `alembic revision --autogenerate -m "descricao"` — importe os models do módulo em `alembic/env.py` antes.
