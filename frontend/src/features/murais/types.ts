/**
 * Modelo alinhado à tabela `avisos` de backend/sql/schema.sql
 * (id, titulo, conteudo, chave_imagem, autor_id, setor_id, criado_em,
 * atualizado_em)
 *
 * `categoria` e `fixado` são exibidos no design mas ainda NÃO existem em
 * schema.sql — ficam mockados aqui até o backend ganhar essas colunas
 * (migration pendente). Ver features/murais/api.ts.
 */
export type CategoriaAviso = 'comunicado' | 'promocao' | 'evento'

export const ROTULO_CATEGORIA: Record<CategoriaAviso, string> = {
  comunicado: 'Comunicado',
  promocao: 'Promoção',
  evento: 'Evento',
}

/** Setor mínimo, só o suficiente para os seletores do mural. Já é descrito
 * em docs/arquitetura-frontend.md como tipo compartilhado (`Setor`) a
 * mover para `shared/types.ts` quando outro módulo precisar dele também. */
export interface Setor {
  id: string
  nome: string
}

export interface Anexo {
  nome: string
  tamanho: string
}

export interface Aviso {
  id: string
  titulo: string
  conteudo: string
  chaveImagem: string | null
  categoria: CategoriaAviso
  fixado: boolean
  autorId: string
  autorNome: string
  setorId: string
  setorNome: string
  anexos: Anexo[]
  criadoEm: string
  atualizadoEm: string | null
}

export interface NovoAviso {
  titulo: string
  conteudo: string
  categoria: CategoriaAviso
  setorId: string
  fixado: boolean
  chaveImagem?: string | null
  anexos?: Anexo[]
}

export type EdicaoAviso = Partial<NovoAviso>

/** Contrato de erro de validação de campo vindo do backend, conforme
 * docs/arquitetura-frontend.md. */
export interface ErroCampo {
  campo: string
  mensagem: string
}
