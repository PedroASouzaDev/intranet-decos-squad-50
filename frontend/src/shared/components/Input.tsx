import { forwardRef, type InputHTMLAttributes } from 'react'

type PropriedadesInput = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, PropriedadesInput>(function Input(
  { className, ...resto },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13.5px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#800020] ${className ?? ''}`}
      {...resto}
    />
  )
})

export default Input
