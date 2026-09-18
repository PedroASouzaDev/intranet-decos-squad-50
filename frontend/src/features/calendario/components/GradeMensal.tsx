import { useMemo } from 'react'
import Botao from '../../../shared/components/Botao'
import { IconeCaretLeft, IconeCaretRight } from '../../../shared/components/icones'
import { DIAS_SEMANA, NOMES_MESES, chaveDiaDeIso, montarGradeMes } from '../formatadores'
import type { Aniversariante, Evento } from '../types'

interface PropriedadesGradeMensal {
  ano: number
  mes: number
  eventos: Evento[]
  aniversariantes: Aniversariante[]
  aoMesAnterior: () => void
  aoProximoMes: () => void
}

function GradeMensal({
  ano,
  mes,
  eventos,
  aniversariantes,
  aoMesAnterior,
  aoProximoMes,
}: PropriedadesGradeMensal) {
  const celulas = useMemo(() => montarGradeMes(ano, mes), [ano, mes])

  const eventosPorDia = useMemo(() => {
    const mapa = new Map<string, Evento[]>()
    for (const evento of eventos) {
      const chave = chaveDiaDeIso(evento.dataInicio)
      mapa.set(chave, [...(mapa.get(chave) ?? []), evento])
    }
    return mapa
  }, [eventos])

  const aniversariantesPorDia = useMemo(() => {
    const mapa = new Map<number, Aniversariante[]>()
    for (const pessoa of aniversariantes) {
      mapa.set(pessoa.dia, [...(mapa.get(pessoa.dia) ?? []), pessoa])
    }
    return mapa
  }, [aniversariantes])

  return (
    <div className="rounded-[10px] bg-white p-5 shadow-[0_1px_2px_rgba(30,42,50,0.04),0_10px_22px_-16px_rgba(30,42,50,0.18)]">
      <div className="mb-[18px] flex items-center gap-3.5">
        <h2 className="m-0 text-[17px] font-bold whitespace-nowrap text-slate-900">
          {NOMES_MESES[mes]} {ano}
        </h2>
        <div className="ml-auto flex gap-1.5">
          <Botao variante="icone" onClick={aoMesAnterior} title="Mês anterior" className="h-[30px] w-[30px] border border-slate-200">
            <IconeCaretLeft tamanho={15} />
          </Botao>
          <Botao variante="icone" onClick={aoProximoMes} title="Próximo mês" className="h-[30px] w-[30px] border border-slate-200">
            <IconeCaretRight tamanho={15} />
          </Botao>
        </div>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-[10px] border border-slate-200">
        {DIAS_SEMANA.map((rotulo) => (
          <span
            key={rotulo}
            className="border-r border-b border-slate-200 bg-slate-50 py-2.5 text-center text-[10px] tracking-wide text-slate-500 last:border-r-0"
          >
            {rotulo}
          </span>
        ))}

        {celulas.map((celula) => {
          const eventosDoDia = eventosPorDia.get(celula.chave) ?? []
          const aniversariantesDoDia = celula.dia ? (aniversariantesPorDia.get(celula.dia) ?? []) : []

          return (
            <div
              key={celula.chave}
              className={`flex min-h-[94px] min-w-0 flex-col gap-1.5 border-r border-b border-slate-200 px-[9px] py-2 [&:nth-child(7n)]:border-r-0 ${
                celula.dia === null ? 'bg-slate-50' : celula.hoje ? 'bg-slate-100' : 'bg-white'
              }`}
            >
              {celula.dia !== null && (
                <span
                  className={`text-[11.5px] ${
                    celula.hoje ? 'font-bold text-[#800020]' : 'font-medium text-slate-600'
                  }`}
                >
                  {String(celula.dia).padStart(2, '0')}
                </span>
              )}
              {eventosDoDia.map((evento) => (
                <span
                  key={evento.id}
                  title={evento.titulo}
                  className="min-w-0 truncate rounded-md bg-[#b33951] px-1.5 py-1 text-[10.5px] leading-snug text-white"
                >
                  {evento.titulo}
                </span>
              ))}
              {aniversariantesDoDia.map((pessoa) => (
                <span
                  key={pessoa.id}
                  title={pessoa.nome}
                  className="min-w-0 truncate rounded-md bg-slate-100 px-1.5 py-1 text-[10.5px] leading-snug text-slate-700"
                >
                  {pessoa.nome}
                </span>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GradeMensal
