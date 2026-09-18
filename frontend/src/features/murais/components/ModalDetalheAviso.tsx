import Botao from '../../../shared/components/Botao'
import { IconeUsuario, IconeX } from '../../../shared/components/icones'
import { formatarDiaMes, formatarHora } from '../formatadores'
import BadgeCategoria from './BadgeCategoria'
import type { Aviso } from '../types'

interface PropriedadesModalDetalheAviso {
  aviso: Aviso | null
  aoFechar: () => void
}


function ModalDetalheAviso({ aviso, aoFechar }: PropriedadesModalDetalheAviso) {
  if (!aviso) return null

  return (
    <div
      onClick={aoFechar}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800/45 p-12"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full min-h-[600px] w-[1000px] max-w-full flex-col overflow-auto rounded-[10px] bg-white p-10 pb-8 shadow-[0_18px_44px_-20px_rgba(30,41,59,0.32)]"
      >
        <div className="mb-[22px] flex items-center gap-3">
          <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-slate-300 text-white">
            <IconeUsuario tamanho={22} />
          </span>
          <div className="flex flex-col leading-snug">
            <span className="text-sm font-semibold text-slate-900">{aviso.autorNome}</span>
            <span className="text-xs text-slate-500">{aviso.setorNome}</span>
          </div>
          <button type="button" onClick={aoFechar} className="ml-auto text-slate-400 hover:text-[#800020]">
            <IconeX tamanho={18} />
          </button>
        </div>
        <div className="mb-4 h-0.5 rounded-full bg-[#800020]" />
        <div className="mb-2.5 flex items-center gap-3">
          <span className="text-[11px] tracking-wide text-slate-400">
            {formatarDiaMes(aviso.criadoEm)} · {formatarHora(aviso.criadoEm)}
          </span>
          <BadgeCategoria categoria={aviso.categoria} />
        </div>
        <div className="flex items-start gap-6">
          {aviso.chaveImagem && (
            <div className="w-[400px] flex-none rounded-[10px] border border-slate-200 bg-slate-50 p-2">
              <div
                className="h-[300px] w-full rounded-md bg-cover bg-center"
                style={{ backgroundImage: `url(${aviso.chaveImagem})` }}
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="m-0 mb-4 text-[26px] leading-tight font-bold tracking-tight text-slate-900 text-balance">
              {aviso.titulo}
            </h2>
            <div className="mb-4 h-px bg-slate-200" />
            <p className="m-0 text-[15px] leading-loose text-slate-700 text-balance whitespace-pre-line">
              {aviso.conteudo}
            </p>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-6">
          <Botao variante="secundario" onClick={aoFechar} className="ml-auto">
            Fechar
          </Botao>
        </div>
      </div>
    </div>
  )
}

export default ModalDetalheAviso
