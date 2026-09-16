import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { useAuth } from '../../../lib/auth/useAuth'
import { criarAviso, editarAviso } from '../api'
import type { EdicaoAviso, ErroCampo, NovoAviso } from '../types'

interface VariaveisSalvarAviso {
  id?: string
  dados: NovoAviso | EdicaoAviso
}

export function useSalvarAviso() {
  const queryClient = useQueryClient()
  const { usuario } = useAuth()

  return useMutation({
    mutationFn: ({ id, dados }: VariaveisSalvarAviso) => {
      if (id) return editarAviso(id, dados)
      // Usuario (lib/auth/tipos.ts) ainda não carrega o nome de exibição
      // — só id/role/setorId vêm do JWT hoje. "Você" é o rótulo até o
      // backend carregar esse dado.
      return criarAviso(dados as NovoAviso, { id: usuario?.id ?? '', nome: 'Você' })
    },
    onSuccess: (_aviso, variaveis) => {
      queryClient.invalidateQueries({ queryKey: ['avisos'] })
      toast.success(variaveis.id ? 'Aviso atualizado com sucesso.' : 'Aviso publicado com sucesso.')
    },
    onError: (erro) => {
      if (isAxiosError<ErroCampo>(erro) && erro.response?.data?.campo) {
        toast.error(erro.response.data.mensagem)
      } else {
        toast.error('Erro ao salvar o aviso. Tente novamente.')
      }
    },
  })
}
