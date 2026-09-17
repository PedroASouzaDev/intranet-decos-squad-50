import uuid
from datetime import date, datetime

from pydantic import BaseModel

from app.modules.usuarios.models import Papel

class UsuarioBase(BaseModel):
  nome: str
  email: str
  role: Papel = Papel.comum
  setor_id: uuid.UUID | None = None
  data_nascimento: date | None = None

class UsuarioCriar(UsuarioBase):
  senha: str

class UsuarioAtualizar(BaseModel):
  nome: str | None = None
  email: str | None = None
  role: Papel | None = None
  setor_id: uuid.UUID | None = None
  data_nascimento: date | None = None
  ativo: bool | None = None

class UsuarioResposta(UsuarioBase):
  id: uuid.UUID
  ativo: bool
  criado_em: datetime

  model_config = {"from_attributes": True}
