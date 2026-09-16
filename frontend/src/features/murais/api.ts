import type { Anexo, Aviso, EdicaoAviso, NovoAviso, Setor } from './types'

// TODO integração: os dados e funções abaixo simulam o retorno da futura
// rota do backend (backend/app/modules/murais, tabela `avisos` em
// backend/sql/schema.sql) já com autor/setor "achatados", como uma API
// real devolveria após o join. Quando o endpoint existir, trocar o corpo
// destas funções por chamadas a `api` (lib/api.ts) — as assinaturas
// exportadas aqui já foram pensadas para não precisar mudar nos hooks.
//
// `categoria` e `fixado` (usados no design) ainda não têm coluna em
// schema.sql — mantidos só no mock até uma migration adicionar os campos.

const ATRASO_MS = 350

function atraso<T>(valor: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ATRASO_MS))
}

function idAleatorio(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

function dataRelativa(diasAtras: number, hora: string): string {
  const data = new Date()
  data.setDate(data.getDate() - diasAtras)
  const [h, m] = hora.split(':').map(Number)
  data.setHours(h, m, 0, 0)
  return data.toISOString()
}

const IMAGEM_MOCK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%231e293b"/></svg>'.replace(/%23/g, '#'),
  )

export const SETORES_MOCK: Setor[] = [
  { id: 'setor-rh', nome: 'Recursos Humanos' },
  { id: 'setor-enfermagem', nome: 'Enfermagem' },
  { id: 'setor-tecnologia', nome: 'Tecnologia' },
  { id: 'setor-farmacia', nome: 'Farmácia' },
  { id: 'setor-diretoria', nome: 'Diretoria' },
]

function nomeSetor(setorId: string): string {
  return SETORES_MOCK.find((s) => s.id === setorId)?.nome ?? ''
}

let avisosMock: Aviso[] = [
  {
    id: idAleatorio(),
    titulo: 'Novo Código de Conduta entra em vigor em 1º de setembro',
    conteudo:
      'Prezados colaboradores, o novo Código de Conduta entra em vigor em 1º de setembro. A leitura e o aceite são obrigatórios para todos os setores.',
    chaveImagem: null,
    categoria: 'comunicado',
    fixado: true,
    autorId: 'usuario-direcao',
    autorNome: 'Direção Geral',
    setorId: 'setor-diretoria',
    setorNome: nomeSetor('setor-diretoria'),
    anexos: [],
    criadoEm: dataRelativa(9, '07:50'),
    atualizadoEm: null,
  },
  {
    id: idAleatorio(),
    titulo: 'Campanha de vacinação contra influenza no ambulatório',
    conteudo:
      'Campanha de vacinação contra influenza no ambulatório do 2º andar, de 25 a 29 deste mês, das 08h às 16h. Levem o crachá funcional.',
    chaveImagem: null,
    categoria: 'comunicado',
    fixado: true,
    autorId: 'usuario-vigilancia',
    autorNome: 'Vigilância Epidemiológica',
    setorId: 'setor-enfermagem',
    setorNome: nomeSetor('setor-enfermagem'),
    anexos: [],
    criadoEm: dataRelativa(8, '11:20'),
    atualizadoEm: null,
  },
  {
    id: idAleatorio(),
    titulo: 'Nova escala de plantão administrativo a partir do próximo mês',
    conteudo:
      'O plantão administrativo do fim de semana passa a funcionar das 07h às 19h, com revezamento entre as equipes de Faturamento, Recepção e Suprimentos. A escala completa está disponível no repositório de documentos, em Recursos Humanos.',
    chaveImagem: null,
    categoria: 'comunicado',
    fixado: false,
    autorId: 'usuario-marina',
    autorNome: 'Marina Alencar',
    setorId: 'setor-rh',
    setorNome: nomeSetor('setor-rh'),
    anexos: [],
    criadoEm: dataRelativa(2, '08:40'),
    atualizadoEm: null,
  },
  {
    id: idAleatorio(),
    titulo: 'Nova checklist de conferência de leitos entra em uso nesta semana',
    conteudo:
      'A checklist de conferência de leitos passa a ser preenchida a cada troca de turno, incluindo a verificação de grades, campainha e identificação do paciente. O modelo está no repositório, em Enfermagem.',
    chaveImagem: IMAGEM_MOCK,
    categoria: 'comunicado',
    fixado: false,
    autorId: 'usuario-nucleo-seguranca',
    autorNome: 'Núcleo de Segurança do Paciente',
    setorId: 'setor-enfermagem',
    setorNome: nomeSetor('setor-enfermagem'),
    anexos: [],
    criadoEm: dataRelativa(2, '07:15'),
    atualizadoEm: null,
  },
  {
    id: idAleatorio(),
    titulo: 'Promoção interna — Camila Nunes assume a coordenação do Centro Cirúrgico',
    conteudo:
      'É com satisfação que anunciamos a promoção de Camila Nunes, que atua há sete anos no hospital, para a coordenação do Centro Cirúrgico. A transição ocorre de forma gradual ao longo deste mês.',
    chaveImagem: null,
    categoria: 'promocao',
    fixado: false,
    autorId: 'usuario-rogerio',
    autorNome: 'Rogério Bastos',
    setorId: 'setor-enfermagem',
    setorNome: nomeSetor('setor-enfermagem'),
    anexos: [],
    criadoEm: dataRelativa(3, '15:12'),
    atualizadoEm: null,
  },
  {
    id: idAleatorio(),
    titulo: 'Manutenção programada do sistema de prontuário',
    conteudo:
      'No próximo sábado, entre 22h e 02h, o sistema de prontuário ficará indisponível para atualização de servidores. Durante a janela, utilizem o formulário de contingência impresso disponível em cada posto.',
    chaveImagem: null,
    categoria: 'comunicado',
    fixado: false,
    autorId: 'usuario-ti',
    autorNome: 'Setor de Tecnologia',
    setorId: 'setor-tecnologia',
    setorNome: nomeSetor('setor-tecnologia'),
    anexos: [],
    criadoEm: dataRelativa(4, '10:05'),
    atualizadoEm: null,
  },
  {
    id: idAleatorio(),
    titulo: 'Semana da Segurança do Paciente — inscrições abertas',
    conteudo:
      'As inscrições para a Semana da Segurança do Paciente estão abertas até o fim da semana. São quatro oficinas práticas com certificação de 12 horas, no auditório do 3º andar.',
    chaveImagem: null,
    categoria: 'evento',
    fixado: false,
    autorId: 'usuario-comissao',
    autorNome: 'Comissão de Eventos',
    setorId: 'setor-diretoria',
    setorNome: nomeSetor('setor-diretoria'),
    anexos: [],
    criadoEm: dataRelativa(6, '09:30'),
    atualizadoEm: null,
  },
]

function ordenados(lista: Aviso[]): Aviso[] {
  return [...lista].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
}

export async function listarAvisos(): Promise<Aviso[]> {
  return atraso(ordenados(avisosMock))
}

export async function listarSetores(): Promise<Setor[]> {
  return atraso(SETORES_MOCK)
}

export async function criarAviso(
  dados: NovoAviso,
  autor: { id: string; nome: string },
): Promise<Aviso> {
  const aviso: Aviso = {
    id: idAleatorio(),
    titulo: dados.titulo,
    conteudo: dados.conteudo,
    chaveImagem: dados.chaveImagem ?? null,
    categoria: dados.categoria,
    fixado: dados.fixado,
    autorId: autor.id,
    autorNome: autor.nome,
    setorId: dados.setorId,
    setorNome: nomeSetor(dados.setorId),
    anexos: dados.anexos ?? ([] as Anexo[]),
    criadoEm: new Date().toISOString(),
    atualizadoEm: null,
  }
  avisosMock = [aviso, ...avisosMock]
  return atraso(aviso)
}

export async function editarAviso(id: string, edicao: EdicaoAviso): Promise<Aviso> {
  let atualizado: Aviso | undefined
  avisosMock = avisosMock.map((a) => {
    if (a.id !== id) return a
    atualizado = {
      ...a,
      ...edicao,
      setorNome: edicao.setorId ? nomeSetor(edicao.setorId) : a.setorNome,
      atualizadoEm: new Date().toISOString(),
    }
    return atualizado
  })
  if (!atualizado) throw new Error('Aviso não encontrado.')
  return atraso(atualizado)
}

export async function excluirAviso(id: string): Promise<void> {
  avisosMock = avisosMock.filter((a) => a.id !== id)
  return atraso(undefined)
}
