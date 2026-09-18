import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base


class TokenAtualizacao(Base):
  __tablename__ = "tokens_atualizacao"

  id: Mapped[uuid.UUID] = mapped_column(
    Uuid, primary_key=True, server_default=text("gen_random_uuid()")
  )
  usuario_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("usuarios.id"))
  token_hash: Mapped[str] = mapped_column(String(255), unique=True)
  expira_em: Mapped[datetime] = mapped_column(DateTime(timezone=True))
  revogado: Mapped[bool] = mapped_column(Boolean, default=False)
  criado_em: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), server_default=func.now()
  )
