from fastapi import Depends, HTTPException

from app.core.security import usuario_atual
from app.modules.usuarios.models import Papel, Usuario

def requer_superadmin(usuario: Usuario = Depends(usuario_atual)) -> Usuario:
  if usuario.role != Papel.superadmin:
    raise HTTPException(403, "Acesso negado")
  return usuario
