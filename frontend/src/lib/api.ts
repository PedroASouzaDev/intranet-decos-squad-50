import axios from 'axios'
import { limparToken, obterToken } from './auth/useAuth'

export const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = obterToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401) {
      limparToken()
    }
    return Promise.reject(erro)
  },
)
