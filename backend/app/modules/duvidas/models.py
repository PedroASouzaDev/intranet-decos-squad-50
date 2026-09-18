import uuid
from datetime import datetime, timezone

from sqlalchemy import Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Duvida(Base):
    __tablename__ = "duvidas"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    pergunta: Mapped[str] = mapped_column(Text, nullable=False)
    resposta: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)

    # Armazena o ID do admin que respondeu, sem FK explícita enquanto o
    # módulo usuarios ainda não está implementado.
    respondido_por_id: Mapped[uuid.UUID | None] = mapped_column(nullable=True, default=None)

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    respondido_em: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )
