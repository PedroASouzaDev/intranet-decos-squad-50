import jwt
from pwdlib import PasswordHash

from app.core.config import configuracoes

hash_de_senha = PasswordHash.recommended()

def gerar_hash_senha(senha: str) -> str:
  return hash_de_senha.hash(senha)


def decodificar_token(token: str) -> dict:
  """Valida assinatura e expiração do access token e devolve o payload."""
  return jwt.decode(
    token,
    configuracoes.segredo_jwt,
    algorithms=[configuracoes.algoritmo_jwt],
  )
