from pydantic import BaseModel


class LoginEntrada(BaseModel):
  email: str
  senha: str


class RefreshEntrada(BaseModel):
  refresh_token: str


class TokenResposta(BaseModel):
  access_token: str
  refresh_token: str
  token_type: str = "bearer"


class AccessTokenResposta(BaseModel):
  access_token: str
  token_type: str = "bearer"
