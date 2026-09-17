import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import gerar_hash_senha
from app.modules.usuarios import repository, schemas
from app.modules.usuarios.models import Usuario


def listar_usuarios(sessao: Session) -> list[Usuario]:
  return repository.listar(sessao)


def criar_usuario(sessao: Session, dados: schemas.UsuarioCriar) -> Usuario:
  usuario = Usuario(
    nome=dados.nome,
    email=dados.email,
    senha_hash=gerar_hash_senha(dados.senha),
    role=dados.role,
    setor_id=dados.setor_id,
    data_nascimento=dados.data_nascimento,
  )
  return repository.criar(sessao, usuario)


def atualizar_usuario(
  sessao: Session, usuario_id: uuid.UUID, dados: schemas.UsuarioAtualizar
) -> Usuario:
  usuario = repository.buscar_por_id(sessao, usuario_id)
  if not usuario:
    raise HTTPException(404, "Usuario nao encontrado")
  for campo, valor in dados.model_dump(exclude_unset=True).items():
    setattr(usuario, campo, valor)
  return repository.salvar(sessao, usuario)


def desativar_usuario(sessao: Session, usuario_id: uuid.UUID) -> Usuario:
  usuario = repository.buscar_por_id(sessao, usuario_id)
  if not usuario:
    raise HTTPException(404, "Usuario nao encontrado")
  usuario.ativo = False
  return repository.salvar(sessao, usuario)
