import uuid
from datetime import date, datetime
from enum import Enum

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.core.database import Base

class Papel(str, Enum):
  comum = "comum"
  admin_setor = "admin_setor"
  superadmin = "superadmin"

class Usuario(Base):
  __tablename__ = "usuarios"

  id: Mapped[uuid.UUID] = mapped_column(
      Uuid, primary_key=True, server_default=text("gen_random_uuid()")
  )
  nome: Mapped[str] = mapped_column(String(200))
  email: Mapped[str] = mapped_column(String(200), unique=True)
  senha_hash: Mapped[str] = mapped_column(String(255))
  role: Mapped[Papel] = mapped_column(String(20), default=Papel.comum)
  setor_id: Mapped[uuid.UUID | None] = mapped_column(
      Uuid, ForeignKey("setores.id"), nullable=True
  )
  data_nascimento: Mapped[date | None] = mapped_column(Date, nullable=True)
  ativo: Mapped[bool] = mapped_column(Boolean, default=True)
  criado_em: Mapped[datetime] = mapped_column(
      DateTime(timezone=True), server_default=func.now()
  )
