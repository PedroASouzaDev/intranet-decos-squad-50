from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def registrar_tratadores_de_erro(app: FastAPI) -> None:
    """Padroniza os erros no contrato que o frontend espera: `{ campo?, mensagem }`.

    Para erro atrelado a um campo, levante `HTTPException` com
    `detail={"campo": ..., "mensagem": ...}`; ele é repassado como está.
    """

    @app.exception_handler(StarletteHTTPException)
    async def tratar_http(request: Request, erro: StarletteHTTPException) -> JSONResponse:
        corpo = erro.detail if isinstance(erro.detail, dict) else {"mensagem": erro.detail}
        return JSONResponse(corpo, status_code=erro.status_code, headers=erro.headers)

    @app.exception_handler(RequestValidationError)
    async def tratar_validacao(request: Request, erro: RequestValidationError) -> JSONResponse:
        primeiro = erro.errors()[0]
        # loc é algo como ("body", "nome") ou ("path", "setor_id")
        local = primeiro["loc"]
        corpo = {"mensagem": primeiro["msg"]}
        if len(local) > 1:
            corpo = {"campo": str(local[-1]), **corpo}
        return JSONResponse(corpo, status_code=status.HTTP_422_UNPROCESSABLE_CONTENT)
