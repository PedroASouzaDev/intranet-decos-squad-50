import { api } from '../../lib/api'
import type { Setor } from '../../shared/types'
import type {
  Aniversariante,
  EdicaoEvento,
  Evento,
  FiltroEventos,
  NovoEvento,
} from './types'

interface EventoApi {
  id: string
  titulo: string
  descricao: string | null
  data_inicio: string
  data_fim: string | null
  setor_id: string
  setor_nome: string
  autor_id: string
  autor_nome: string
  criado_em: string
}

interface AniversarianteApi {
  id: string
  nome: string
  dia: number
  setor_id: string | null
  setor_nome: string | null
}

interface SetorApi {
  id: string
  nome: string
}

function paraEvento(bruto: EventoApi): Evento {
  return {
    id: bruto.id,
    titulo: bruto.titulo,
    descricao: bruto.descricao,
    dataInicio: bruto.data_inicio,
    dataFim: bruto.data_fim,
    setorId: bruto.setor_id,
    setorNome: bruto.setor_nome,
    autorId: bruto.autor_id,
    autorNome: bruto.autor_nome,
    criadoEm: bruto.criado_em,
  }
}

function paraAniversariante(bruto: AniversarianteApi): Aniversariante {
  return {
    id: bruto.id,
    nome: bruto.nome,
    dia: bruto.dia,
    setorId: bruto.setor_id,
    setorNome: bruto.setor_nome,
  }
}

function paraCorpoEvento(dados: NovoEvento | EdicaoEvento) {
  return {
    titulo: dados.titulo,
    descricao: dados.descricao ?? null,
    data_inicio: dados.dataInicio,
    data_fim: dados.dataFim ?? null,
    ...('setorId' in dados && dados.setorId ? { setor_id: dados.setorId } : {}),
  }
}

export async function listarEventos(filtro: FiltroEventos = {}): Promise<Evento[]> {
  const { data } = await api.get<EventoApi[]>('/calendario/eventos', {
    params: { de: filtro.de, ate: filtro.ate, setor_id: filtro.setorId },
  })
  return data.map(paraEvento)
}

export async function buscarEvento(id: string): Promise<Evento> {
  const { data } = await api.get<EventoApi>(`/calendario/eventos/${id}`)
  return paraEvento(data)
}

export async function criarEvento(dados: NovoEvento): Promise<Evento> {
  const { data } = await api.post<EventoApi>('/calendario/eventos', paraCorpoEvento(dados))
  return paraEvento(data)
}

export async function editarEvento(id: string, dados: EdicaoEvento): Promise<Evento> {
  const { data } = await api.put<EventoApi>(`/calendario/eventos/${id}`, paraCorpoEvento(dados))
  return paraEvento(data)
}

export async function excluirEvento(id: string): Promise<void> {
  await api.delete(`/calendario/eventos/${id}`)
}

export async function listarAniversariantes(mes?: number): Promise<Aniversariante[]> {
  const { data } = await api.get<AniversarianteApi[]>('/calendario/aniversariantes', {
    params: { mes },
  })
  return data.map(paraAniversariante)
}

export async function listarSetores(): Promise<Setor[]> {
  const { data } = await api.get<SetorApi[]>('/setores')
  return data.map((setor) => ({ id: setor.id, nome: setor.nome }))
}
