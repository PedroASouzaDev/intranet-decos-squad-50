import { useQuery } from '@tanstack/react-query'
import { listarSetores } from '../api'

export function useSetoresCalendario() {
  return useQuery({
    queryKey: ['calendario', 'setores'],
    queryFn: listarSetores,
  })
}
