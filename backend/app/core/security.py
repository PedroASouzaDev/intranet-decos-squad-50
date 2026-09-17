import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Final

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.core.config import configuracoes
from app.core.database import obter_sessao
from app.modules.usuarios.models import Usuario

hash_de_senha = PasswordHash.recommended()
esquema_bearer = HTTPBearer()

ALGORITMO: Final = "HS256"


def gerar_hash_senha(senha: str) -> str:
  return hash_de_senha.hash(senha)


def verificar_senha(senha: str, hash_armazenado: str) -> bool:
  return hash_de_senha.verify(senha, hash_armazenado)


def criar_access_token(usuario: Usuario) -> str:
  expira_em = datetime.now(timezone.utc) + timedelta(
    minutes=configuracoes.access_token_minutos
  )
  payload = {
    "sub": str(usuario.id),
    "role": usuario.role,
    "setor_id": str(usuario.setor_id) if usuario.setor_id else None,
    "exp": expira_em,
  }
  return jwt.encode(payload, configuracoes.jwt_secret, algorithm=ALGORITMO)


def gerar_refresh_token() -> str:
  return secrets.token_urlsafe(32)


def hash_refresh_token(token: str) -> str:
  return hashlib.sha256(token.encode()).hexdigest()


def decodificar_token(token: str) -> dict:
  """Valida assinatura e expiração do access token e devolve o payload."""
  return jwt.decode(token, configuracoes.jwt_secret, algorithms=[ALGORITMO])


def usuario_atual(
  credenciais: HTTPAuthorizationCredentials = Depends(esquema_bearer),
  sessao: Session = Depends(obter_sessao),
) -> Usuario:
  try:
    payload = decodificar_token(credenciais.credentials)
  except jwt.PyJWTError:
    raise HTTPException(401, "Token invalido ou expirado")

  usuario = sessao.get(Usuario, uuid.UUID(payload["sub"]))
  if not usuario or not usuario.ativo:
    raise HTTPException(401, "Usuario nao encontrado ou inativo")
  return usuario
