from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.duvidas.models import Duvida


def enviar_duvida(db: Session, pergunta: str) -> Duvida:
    """Persiste uma nova dúvida. O remetente não é rastreado por design."""
    duvida = Duvida(pergunta=pergunta)
    db.add(duvida)
    db.commit()
    db.refresh(duvida)
    return duvida


def listar_faq(db: Session) -> list[Duvida]:
    """Retorna todas as dúvidas que já possuem resposta, ordenadas da mais recente."""
    return (
        db.query(Duvida)
        .filter(Duvida.resposta.isnot(None))
        .order_by(Duvida.respondido_em.desc())
        .all()
    )


def listar_pendentes(db: Session) -> list[Duvida]:
    """Retorna dúvidas ainda sem resposta, ordenadas da mais antiga (FIFO)."""
    return (
        db.query(Duvida)
        .filter(Duvida.resposta.is_(None))
        .order_by(Duvida.criado_em.asc())
        .all()
    )


def responder_duvida(
    db: Session,
    id: UUID,
    resposta: str,
    admin_id: UUID,
) -> Duvida:
    """
    Cadastra (ou atualiza) a resposta de uma dúvida.
    A partir deste momento a dúvida passa a aparecer na FAQ pública.
    """
    duvida = db.query(Duvida).filter(Duvida.id == id).first()
    if not duvida:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Duvida nao encontrada",
        )
    duvida.resposta = resposta
    duvida.respondido_por_id = admin_id
    duvida.respondido_em = datetime.now(timezone.utc)
    db.commit()
    db.refresh(duvida)
    return duvida


def deletar_duvida(db: Session, id: UUID) -> None:
    """Remove uma dúvida independentemente de ter resposta ou não."""
    duvida = db.query(Duvida).filter(Duvida.id == id).first()
    if not duvida:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Duvida nao encontrada",
        )
    db.delete(duvida)
    db.commit()
