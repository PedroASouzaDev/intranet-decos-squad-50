import { forwardRef, type SelectHTMLAttributes } from 'react'

type PropriedadesSelect = SelectHTMLAttributes<HTMLSelectElement>

const Select = forwardRef<HTMLSelectElement, PropriedadesSelect>(function Select(
  { className, children, ...resto },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13.5px] text-slate-800 outline-none focus:border-[#800020] ${className ?? ''}`}
      {...resto}
    >
      {children}
    </select>
  )
})

export default Select
