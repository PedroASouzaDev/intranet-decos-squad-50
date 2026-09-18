import { forwardRef, type ButtonHTMLAttributes } from 'react'

type VarianteBotao = 'primario' | 'secundario' | 'icone'

interface PropriedadesBotao extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
}

const ESTILOS: Record<VarianteBotao, string> = {
  primario:
    'bg-[#800020] text-white hover:bg-[#3b000e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed',
  secundario: 'border border-slate-200 text-slate-600 hover:bg-slate-100',
  icone: 'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
}

const Botao = forwardRef<HTMLButtonElement, PropriedadesBotao>(function Botao(
  { variante = 'secundario', className, ...resto },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`cursor-pointer rounded-lg text-[13px] font-medium transition-colors ${
        variante === 'icone' ? 'flex h-8 w-8 items-center justify-center rounded-lg' : 'px-[18px] py-2.5'
      } ${ESTILOS[variante]} ${className ?? ''}`}
      {...resto}
    />
  )
})

export default Botao
