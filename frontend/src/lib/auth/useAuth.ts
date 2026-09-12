import { useState } from 'react'
import type { Usuario } from './tipos'

const CHAVE_TOKEN = 'intranet:token'

function decodificarUsuario(token: string): Usuario {
  const payload = token.split('.')[1]
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
  const carga = JSON.parse(json)
  return { id: carga.sub, role: carga.role, setorId: carga.setor_id }
}

export function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function limparToken() {
  localStorage.removeItem(CHAVE_TOKEN)
}

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const token = obterToken()
    return token ? decodificarUsuario(token) : null
  })

  function entrar(token: string) {
    localStorage.setItem(CHAVE_TOKEN, token)
    setUsuario(decodificarUsuario(token))
  }

  function sair() {
    limparToken()
    setUsuario(null)
  }

  return { usuario, entrar, sair }
}
