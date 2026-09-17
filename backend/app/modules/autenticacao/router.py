from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import obter_sessao
from app.modules.autenticacao import schemas, service

router = APIRouter(prefix="/auth", tags=["autenticacao"])


@router.post("/login", response_model=schemas.TokenResposta)
def login(dados: schemas.LoginEntrada, sessao: Session = Depends(obter_sessao)):
  access_token, refresh_token = service.autenticar(sessao, dados.email, dados.senha)
  return schemas.TokenResposta(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=schemas.AccessTokenResposta)
def refresh(dados: schemas.RefreshEntrada, sessao: Session = Depends(obter_sessao)):
  access_token = service.renovar(sessao, dados.refresh_token)
  return schemas.AccessTokenResposta(access_token=access_token)
