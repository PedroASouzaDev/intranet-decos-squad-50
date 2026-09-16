import { forwardRef, type TextareaHTMLAttributes } from 'react'

type PropriedadesTextarea = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, PropriedadesTextarea>(function Textarea(
  { className, ...resto },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={`w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-[13.5px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#800020] ${className ?? ''}`}
      {...resto}
    />
  )
})

export default Textarea
