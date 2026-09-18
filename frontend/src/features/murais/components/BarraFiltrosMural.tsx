import Dropdown from '../../../shared/components/Dropdown'
import { IconeFunil, IconeLupa, IconeMais, IconePredio } from '../../../shared/components/icones'
import { ROTULO_CATEGORIA, type CategoriaAviso, type Setor } from '../types'

interface PropriedadesBarraFiltros {
  busca: string
  aoMudarBusca: (valor: string) => void
  categoria: CategoriaAviso | ''
  aoMudarCategoria: (valor: CategoriaAviso | '') => void
  setorId: string
  aoMudarSetor: (valor: string) => void
  setores: Setor[]
  podeCriar: boolean
  aoNovoAviso: () => void
}

const OPCOES_CATEGORIA = [
  { valor: '', rotulo: 'Todas as categorias' },
  ...(Object.entries(ROTULO_CATEGORIA) as [CategoriaAviso, string][]).map(([valor, rotulo]) => ({
    valor,
    rotulo,
  })),
]

function BarraFiltrosMural({
  busca,
  aoMudarBusca,
  categoria,
  aoMudarCategoria,
  setorId,
  aoMudarSetor,
  setores,
  podeCriar,
  aoNovoAviso,
}: PropriedadesBarraFiltros) {
  const opcoesSetor = [
    { valor: '', rotulo: 'Todos os setores' },
    ...setores.map((s) => ({ valor: s.id, rotulo: s.nome })),
  ]

  return (
    <div className="mb-5 flex items-stretch gap-3.5">
      <label className="relative block flex-[0_1_320px]">
        <IconeLupa
          tamanho={16}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
        />
        <input
          value={busca}
          onChange={(e) => aoMudarBusca(e.target.value)}
          placeholder="Buscar aviso por título, autor ou conteúdo"
          className="h-full w-full rounded-[10px] border border-slate-200 bg-white py-2.5 pr-3.5 pl-[38px] text-[13px] text-slate-800 shadow-[0_1px_2px_rgba(30,42,50,0.04),0_10px_22px_-16px_rgba(30,42,50,0.18)] outline-none focus:border-[#800020]"
        />
      </label>

      <Dropdown
        rotuloPadrao="Categoria"
        icone={<IconeFunil tamanho={15} />}
        opcoes={OPCOES_CATEGORIA}
        valor={categoria}
        aoMudar={(v) => aoMudarCategoria(v as CategoriaAviso | '')}
      />

      <Dropdown
        rotuloPadrao="Setor"
        icone={<IconePredio tamanho={15} />}
        opcoes={opcoesSetor}
        valor={setorId}
        aoMudar={aoMudarSetor}
      />

      {podeCriar && (
        <button
          type="button"
          onClick={aoNovoAviso}
          className="ml-auto flex flex-none items-center gap-2 whitespace-nowrap rounded-[10px] bg-[#800020] px-[18px] text-[13px] font-medium text-white hover:bg-[#3b000e]"
        >
          <IconeMais tamanho={15} />
          Novo aviso
        </button>
      )}
    </div>
  )
}

export default BarraFiltrosMural
