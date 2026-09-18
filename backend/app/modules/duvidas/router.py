from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import obter_sessao
from app.core.permissions import requer_admin, requer_autenticado
from app.modules.duvidas import service
from app.modules.duvidas.schemas import (
    DuvidaEnvio,
    DuvidaPendente,
    DuvidaPublica,
    RespostaInput,
)

router = APIRouter(prefix="/duvidas", tags=["duvidas"])


@router.post("", status_code=status.HTTP_201_CREATED)
def enviar_duvida(
    dados: DuvidaEnvio,
    db: Session = Depends(obter_sessao),
    _: dict = Depends(requer_autenticado),
):
    """
    Envia uma nova dúvida.

    Qualquer colaborador autenticado pode enviar. O remetente não é rastreado
    e não acompanha o status da própria pergunta.
    """
    service.enviar_duvida(db, dados.pergunta)
    return {"mensagem": "Duvida enviada com sucesso"}


@router.get("/faq", response_model=list[DuvidaPublica])
def listar_faq(
    db: Session = Depends(obter_sessao),
    _: dict = Depends(requer_autenticado),
):
    """
    Lista todas as dúvidas que já possuem resposta (FAQ pública).

    Visível para qualquer colaborador autenticado.
    """
    return service.listar_faq(db)


@router.get("/pendentes", response_model=list[DuvidaPendente])
def listar_pendentes(
    db: Session = Depends(obter_sessao),
    _: dict = Depends(requer_admin),
):
    """
    Lista dúvidas ainda sem resposta.

    Restrito a admin_setor e superadmin.
    """
    return service.listar_pendentes(db)


@router.post("/{id}/resposta", response_model=DuvidaPublica)
def responder_duvida(
    id: UUID,
    dados: RespostaInput,
    db: Session = Depends(obter_sessao),
    usuario: dict = Depends(requer_admin),
):
    """
    Cadastra ou atualiza a resposta de uma dúvida.

    Ao receber resposta, a dúvida passa a aparecer na FAQ pública.
    Restrito a admin_setor e superadmin.
    """
    admin_id = UUID(usuario["sub"])
    return service.responder_duvida(db, id, dados.resposta, admin_id)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_duvida(
    id: UUID,
    db: Session = Depends(obter_sessao),
    _: dict = Depends(requer_admin),
):
    """
    Remove uma dúvida (com ou sem resposta).

    Restrito a admin_setor e superadmin.
    """
    service.deletar_duvida(db, id)
