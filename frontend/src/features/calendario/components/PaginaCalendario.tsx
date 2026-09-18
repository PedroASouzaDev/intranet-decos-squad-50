import { useMemo, useState } from 'react'
import { useAuth } from '../../../lib/auth/useAuth'
import { podeEditar, podeGerenciarConteudo } from '../../../lib/permissions'
import Botao from '../../../shared/components/Botao'
import { IconeMais } from '../../../shared/components/icones'
import { intervaloDoMes } from '../formatadores'
import { useAniversariantes } from '../hooks/useAniversariantes'
import { useEventos } from '../hooks/useEventos'
import { useExcluirEvento } from '../hooks/useExcluirEvento'
import { useSetoresCalendario } from '../hooks/useSetoresCalendario'
import type { Evento } from '../types'
import GradeMensal from './GradeMensal'
import ModalEvento from './ModalEvento'
import PainelAniversariantes from './PainelAniversariantes'
import PainelProximosEventos from './PainelProximosEventos'

const LIMITE_PROXIMOS_EVENTOS = 5

function PaginaCalendario() {
  const { usuario } = useAuth()
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())
  const [modalAberto, setModalAberto] = useState(false)
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null)

  const { data: eventos = [], isLoading, isError } = useEventos(intervaloDoMes(ano, mes))
  const { data: aniversariantes = [] } = useAniversariantes(mes + 1)
  const { data: setores = [] } = useSetoresCalendario()
  const excluirEvento = useExcluirEvento()

  const podeCriar = podeGerenciarConteudo(usuario)

  const proximosEventos = useMemo(() => {
    const inicioDeHoje = new Date()
    inicioDeHoje.setHours(0, 0, 0, 0)
    return eventos
      .filter((evento) => new Date(evento.dataInicio) >= inicioDeHoje)
      .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
      .slice(0, LIMITE_PROXIMOS_EVENTOS)
  }, [eventos])

  function podeGerenciarEsteEvento(evento: Evento) {
    return usuario ? podeEditar(usuario, evento) : false
  }

  function mesAnterior() {
    if (mes === 0) {
      setMes(11)
      setAno(ano - 1)
    } else {
      setMes(mes - 1)
    }
  }

  function proximoMes() {
    if (mes === 11) {
      setMes(0)
      setAno(ano + 1)
    } else {
      setMes(mes + 1)
    }
  }

  function abrirNovoEvento() {
    setEventoEditando(null)
    setModalAberto(true)
  }

  function abrirEdicao(evento: Evento) {
    setEventoEditando(evento)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setEventoEditando(null)
  }

  function aoExcluir(evento: Evento) {
    if (window.confirm(`Excluir o evento "${evento.titulo}"? Essa ação não pode ser desfeita.`)) {
      excluirEvento.mutate(evento.id)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Carregando calendário…</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-5">
        <h1 className="m-0 text-[31px] font-bold tracking-tight text-slate-900">
          Calendário &amp; aniversariantes
        </h1>
        {podeCriar && (
          <Botao
            variante="primario"
            onClick={abrirNovoEvento}
            className="ml-auto flex items-center gap-2 whitespace-nowrap"
          >
            <IconeMais tamanho={15} />
            Novo evento
          </Botao>
        )}
      </div>

      {/* Sem o backend rodando, as chamadas à API falham e este aviso aparece;
          a grade continua renderizando (vazia) para permitir ver o layout. */}
      {isError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Não foi possível carregar os eventos. Verifique se o backend está no ar e tente novamente.
        </p>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)_316px] items-start gap-[22px]">
        <GradeMensal
          ano={ano}
          mes={mes}
          eventos={eventos}
          aniversariantes={aniversariantes}
          aoMesAnterior={mesAnterior}
          aoProximoMes={proximoMes}
        />
        <div className="flex flex-col gap-[22px]">
          <PainelAniversariantes mes={mes} aniversariantes={aniversariantes} />
          <PainelProximosEventos
            eventos={proximosEventos}
            podeGerenciarEvento={podeGerenciarEsteEvento}
            aoEditar={abrirEdicao}
            aoExcluir={aoExcluir}
          />
        </div>
      </div>

      {modalAberto && (
        <ModalEvento
          key={eventoEditando?.id ?? 'novo'}
          aoFechar={fecharModal}
          eventoEditando={eventoEditando}
          setores={setores}
          usuario={usuario}
        />
      )}
    </div>
  )
}

export default PaginaCalendario
