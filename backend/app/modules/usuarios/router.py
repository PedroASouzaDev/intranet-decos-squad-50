import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import obter_sessao
from app.modules.usuarios import schemas, service
from app.modules.usuarios.dependencies import requer_superadmin
from app.modules.usuarios.models import Usuario

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

@router.get("", response_model=list[schemas.UsuarioResposta])
def listar_usuarios(
  sessao: Session = Depends(obter_sessao),
  _: Usuario = Depends(requer_superadmin),
):
  return service.listar_usuarios(sessao)


@router.post("", response_model=schemas.UsuarioResposta)
def criar_usuario(
  dados: schemas.UsuarioCriar,
  sessao: Session = Depends(obter_sessao),
  _: Usuario = Depends(requer_superadmin),
):
  return service.criar_usuario(sessao, dados)


@router.put("/{usuario_id}", response_model=schemas.UsuarioResposta)
def atualizar_usuario(
  usuario_id: uuid.UUID,
  dados: schemas.UsuarioAtualizar,
  sessao: Session = Depends(obter_sessao),
  _: Usuario = Depends(requer_superadmin),
):
  return service.atualizar_usuario(sessao, usuario_id, dados)


@router.delete("/{usuario_id}", response_model=schemas.UsuarioResposta)
def desativar_usuario(
  usuario_id: uuid.UUID,
  sessao: Session = Depends(obter_sessao),
  _: Usuario = Depends(requer_superadmin),
):
  return service.desativar_usuario(sessao, usuario_id)
