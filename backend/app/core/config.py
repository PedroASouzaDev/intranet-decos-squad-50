from pydantic_settings import BaseSettings, SettingsConfigDict

class Configuracoes(BaseSettings):
  model_config = SettingsConfigDict(env_file=".env", extra="ignore")
  database_url: str = "postgresql://postgres:postgres@localhost:5432/intranet"

configuracoes = Configuracoes()
