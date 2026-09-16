import { useEffect, useRef, useState } from 'react'
import { IconeCaretDown } from './icones'

interface OpcaoDropdown {
  valor: string
  rotulo: string
}

interface PropriedadesDropdown {
  rotuloPadrao: string
  icone?: React.ReactNode
  opcoes: OpcaoDropdown[]
  valor: string
  aoMudar: (valor: string) => void
  valorPadrao?: string
}

// Dropdown de filtro
function Dropdown({ rotuloPadrao, icone, opcoes, valor, aoMudar, valorPadrao = '' }: PropriedadesDropdown) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  const opcaoAtual = opcoes.find((o) => o.valor === valor)
  const ativo = valor !== valorPadrao
  const rotulo = ativo && opcaoAtual ? opcaoAtual.rotulo : rotuloPadrao

  return (
    <div ref={ref} className="relative flex-none">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        className={`flex h-full items-center gap-2 whitespace-nowrap rounded-[10px] border border-slate-200 bg-white px-3.5 text-[13px] font-medium hover:bg-slate-100 ${
          ativo ? 'text-[#800020]' : 'text-slate-600'
        }`}
      >
        {icone}
        {rotulo}
        <IconeCaretDown tamanho={13} className="text-slate-400" />
      </button>
      {aberto && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-30 flex min-w-[190px] flex-col rounded-[10px] border border-slate-200 bg-white p-1.5 shadow-[0_12px_28px_-14px_rgba(30,41,59,0.28)]">
          {opcoes.map((o) => (
            <button
              key={o.valor}
              type="button"
              onClick={() => {
                aoMudar(o.valor)
                setAberto(false)
              }}
              className={`rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-slate-100 ${
                o.valor === valor ? 'font-semibold text-[#800020]' : 'font-medium text-slate-700'
              }`}
            >
              {o.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
