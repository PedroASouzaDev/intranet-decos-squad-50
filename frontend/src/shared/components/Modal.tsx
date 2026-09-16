import type { ReactNode } from 'react'
import { IconeX } from './icones'

interface PropriedadesModal {
  aberto: boolean
  titulo: string
  aoFechar: () => void
  largura?: string
  children: ReactNode
}

function Modal({ aberto, titulo, aoFechar, largura = '560px', children }: PropriedadesModal) {
  if (!aberto) return null

  return (
    <div
      onClick={aoFechar}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800/45 p-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: largura }}
        className="flex max-h-full w-full max-w-full flex-col overflow-auto rounded-[10px] bg-white p-6 pb-5 shadow-[0_18px_44px_-20px_rgba(30,41,59,0.32)]"
      >
        <div className="mb-5 flex items-center gap-4">
          <h2 className="m-0 text-[19px] font-bold tracking-tight text-slate-900">{titulo}</h2>
          <button
            type="button"
            onClick={aoFechar}
            className="ml-auto flex text-slate-400 hover:text-[#800020]"
            title="Fechar"
          >
            <IconeX tamanho={17} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
