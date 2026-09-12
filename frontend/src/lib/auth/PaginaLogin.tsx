import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../api'
import { useAuth } from './useAuth'

interface FormularioLogin {
  email: string
  senha: string
}

function PaginaLogin() {
  const { register, handleSubmit } = useForm<FormularioLogin>()
  const { entrar } = useAuth()
  const navegar = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: (dados: FormularioLogin) =>
      api.post<{ access_token: string }>('/auth/login', dados),
    onSuccess: (resposta) => {
      entrar(resposta.data.access_token)
      navegar('/mural')
    },
    onError: () => toast.error('E-mail ou senha inválidos.'),
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit((dados) => mutate(dados))}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-gray-900">Intranet do Hospital</h1>
        <input
          type="email"
          placeholder="E-mail"
          className="rounded border border-gray-300 px-3 py-2"
          {...register('email', { required: true })}
        />
        <input
          type="password"
          placeholder="Senha"
          className="rounded border border-gray-300 px-3 py-2"
          {...register('senha', { required: true })}
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-gray-900 px-3 py-2 text-white disabled:opacity-50"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}

export default PaginaLogin
