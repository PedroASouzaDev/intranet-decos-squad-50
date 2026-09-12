export type Papel = 'comum' | 'admin_setor' | 'superadmin'

export interface Usuario {
  id: string
  role: Papel
  setorId: string | null
}
