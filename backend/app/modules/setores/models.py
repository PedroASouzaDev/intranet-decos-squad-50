import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Setor(Base):
    __tablename__ = "setores"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    nome: Mapped[str] = mapped_column(String(200), unique=True)
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    ramais: Mapped[list["Ramal"]] = relationship(
        back_populates="setor",
        cascade="all, delete-orphan",
        order_by="Ramal.numero",
    )


class Ramal(Base):
    __tablename__ = "ramais"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    numero: Mapped[str] = mapped_column(String(20))
    setor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("setores.id"), index=True)

    setor: Mapped[Setor] = relationship(back_populates="ramais")
