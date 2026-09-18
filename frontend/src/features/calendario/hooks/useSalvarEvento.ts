import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import type { ErroCampo } from '../../../shared/types'
import { criarEvento, editarEvento } from '../api'
import type { EdicaoEvento, NovoEvento } from '../types'

interface VariaveisSalvarEvento {
  id?: string
  dados: NovoEvento | EdicaoEvento
}

export function useSalvarEvento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dados }: VariaveisSalvarEvento) => {
      if (id) return editarEvento(id, dados)
      return criarEvento(dados as NovoEvento)
    },
    onSuccess: (_evento, variaveis) => {
      queryClient.invalidateQueries({ queryKey: ['calendario', 'eventos'] })
      toast.success(variaveis.id ? 'Evento atualizado com sucesso.' : 'Evento criado com sucesso.')
    },
    onError: (erro) => {
      if (isAxiosError<ErroCampo>(erro) && erro.response?.data?.campo) {
        toast.error(erro.response.data.mensagem)
      } else {
        toast.error('Erro ao salvar o evento. Tente novamente.')
      }
    },
  })
}
