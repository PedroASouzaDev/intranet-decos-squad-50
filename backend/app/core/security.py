from pwdlib import PasswordHash

hash_de_senha = PasswordHash.recommended()

def gerar_hash_senha(senha: str) -> str:
  return hash_de_senha.hash(senha)
