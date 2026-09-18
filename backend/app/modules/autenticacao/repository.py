from sqlalchemy.orm import Session

from app.modules.autenticacao.models import TokenAtualizacao


def criar_token(sessao: Session, token: TokenAtualizacao) -> TokenAtualizacao:
  sessao.add(token)
  sessao.commit()
  return token


def buscar_por_hash(sessao: Session, token_hash: str) -> TokenAtualizacao | None:
  return (
    sessao.query(TokenAtualizacao)
    .filter(TokenAtualizacao.token_hash == token_hash)
    .first()
  )
