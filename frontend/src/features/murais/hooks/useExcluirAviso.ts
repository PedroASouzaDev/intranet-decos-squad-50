import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { excluirAviso } from '../api'

export function useExcluirAviso() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => excluirAviso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avisos'] })
      toast.success('Aviso excluído.')
    },
    onError: () => toast.error('Erro ao excluir o aviso. Tente novamente.'),
  })
}
