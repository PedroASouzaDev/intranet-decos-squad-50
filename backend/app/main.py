from fastapi import FastAPI

from app.modules.usuarios.router import router as router_usuarios

app = FastAPI(title="Intranet do Hospital")

app.include_router(router_usuarios)
