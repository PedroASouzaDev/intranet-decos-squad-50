import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { excluirEvento } from '../api'

export function useExcluirEvento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => excluirEvento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendario', 'eventos'] })
      toast.success('Evento excluído.')
    },
    onError: () => toast.error('Erro ao excluir o evento. Tente novamente.'),
  })
}
