from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class DuvidaEnvio(BaseModel):
    """Payload enviado pelo usuário ao abrir uma dúvida."""

    pergunta: str

    @field_validator("pergunta")
    @classmethod
    def pergunta_nao_vazia(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("A pergunta nao pode ser vazia")
        return v


class RespostaInput(BaseModel):
    """Payload enviado pelo admin ao cadastrar a resposta."""

    resposta: str

    @field_validator("resposta")
    @classmethod
    def resposta_nao_vazia(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("A resposta nao pode ser vazia")
        return v


class DuvidaPublica(BaseModel):
    """Representação de uma dúvida respondida — exibida na FAQ pública."""

    id: UUID
    pergunta: str
    resposta: str
    respondido_em: datetime

    model_config = {"from_attributes": True}


class DuvidaPendente(BaseModel):
    """Representação de uma dúvida ainda sem resposta — visível apenas para admins."""

    id: UUID
    pergunta: str
    criado_em: datetime

    model_config = {"from_attributes": True}
