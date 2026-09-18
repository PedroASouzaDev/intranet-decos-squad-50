import { useState } from 'react'
import { useAuth } from '../../../lib/auth/useAuth'
import { podeGerenciarConteudo } from '../../../lib/permissions'
import Botao from '../../../shared/components/Botao'
import { IconeMais } from '../../../shared/components/icones'
import { intervaloDoMes } from '../formatadores'
import { useAniversariantes } from '../hooks/useAniversariantes'
import { useEventos } from '../hooks/useEventos'
import GradeMensal from './GradeMensal'

function PaginaCalendario() {
  const { usuario } = useAuth()
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth())

  const { data: eventos = [] } = useEventos(intervaloDoMes(ano, mes))
  const { data: aniversariantes = [] } = useAniversariantes(mes + 1)

  const podeCriar = podeGerenciarConteudo(usuario)

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

  return (
    <div>
      <div className="mb-6 flex items-center gap-5">
        <h1 className="m-0 text-[31px] font-bold tracking-tight text-slate-900">
          Calendário &amp; aniversariantes
        </h1>
        {podeCriar && (
          <Botao variante="primario" className="ml-auto flex items-center gap-2 whitespace-nowrap">
            <IconeMais tamanho={15} />
            Novo evento
          </Botao>
        )}
      </div>

      <GradeMensal
        ano={ano}
        mes={mes}
        eventos={eventos}
        aniversariantes={aniversariantes}
        aoMesAnterior={mesAnterior}
        aoProximoMes={proximoMes}
      />
    </div>
  )
}

export default PaginaCalendario
