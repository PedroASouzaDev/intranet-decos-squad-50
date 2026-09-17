from pydantic_settings import BaseSettings, SettingsConfigDict


class Configuracoes(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://postgres:postgres@localhost:5432/intranet"

    segredo_jwt: str
    algoritmo_jwt: str = "HS256"
    minutos_expiracao_token_acesso: int = 30

    # Só necessário em dev, quando frontend e backend rodam em portas diferentes.
    origens_cors: list[str] = []


configuracoes = Configuracoes()
