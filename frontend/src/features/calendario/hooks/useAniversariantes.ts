import { useQuery } from '@tanstack/react-query'
import { listarAniversariantes } from '../api'

export function useAniversariantes(mes?: number) {
  return useQuery({
    queryKey: ['calendario', 'aniversariantes', mes],
    queryFn: () => listarAniversariantes(mes),
  })
}
