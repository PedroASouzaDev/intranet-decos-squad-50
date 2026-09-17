import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EventoCriar(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    titulo: str = Field(min_length=1, max_length=200)
    descricao: str | None = None
    data_inicio: datetime
    data_fim: datetime | None = None
    # Só o superadmin escolhe: para admin_setor o service força o próprio setor.
    setor_id: uuid.UUID | None = None


class EventoAtualizar(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    # setor_id e autor_id não são editáveis: trocar o setor mudaria quem pode editar o evento.
    titulo: str = Field(min_length=1, max_length=200)
    descricao: str | None = None
    data_inicio: datetime
    data_fim: datetime | None = None


class EventoResposta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    titulo: str
    descricao: str | None
    data_inicio: datetime
    data_fim: datetime | None
    setor_id: uuid.UUID
    setor_nome: str
    autor_id: uuid.UUID
    autor_nome: str
    criado_em: datetime


class AniversarianteResposta(BaseModel):
    """Derivado de usuarios.data_nascimento — o ano nunca é exposto, para não revelar idade."""

    id: uuid.UUID
    nome: str
    dia: int
    setor_id: uuid.UUID | None
    setor_nome: str | None
