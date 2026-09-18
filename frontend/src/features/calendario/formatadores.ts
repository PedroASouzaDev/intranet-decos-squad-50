export const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export const MESES_ABREV = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
]

export const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

function doisDigitos(valor: number): string {
  return String(valor).padStart(2, '0')
}

export function chaveDia(ano: number, mes: number, dia: number): string {
  return `${ano}-${doisDigitos(mes + 1)}-${doisDigitos(dia)}`
}

export function chaveDiaDeIso(iso: string): string {
  const data = new Date(iso)
  return chaveDia(data.getFullYear(), data.getMonth(), data.getDate())
}

export function formatarHora(iso: string): string {
  const data = new Date(iso)
  return `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`
}

export function formatarDiaMes(iso: string): { dia: string; mes: string } {
  const data = new Date(iso)
  return { dia: doisDigitos(data.getDate()), mes: MESES_ABREV[data.getMonth()] }
}

export function separarDataHora(iso: string): { data: string; hora: string } {
  return { data: chaveDiaDeIso(iso), hora: formatarHora(iso) }
}

export function combinarDataHora(data: string, hora: string): string {
  const [ano, mes, dia] = data.split('-').map(Number)
  const [horas, minutos] = (hora || '00:00').split(':').map(Number)
  return new Date(ano, mes - 1, dia, horas, minutos).toISOString()
}

export function intervaloDoMes(ano: number, mes: number): { de: string; ate: string } {
  const ultimoDia = new Date(ano, mes + 1, 0).getDate()
  return { de: chaveDia(ano, mes, 1), ate: chaveDia(ano, mes, ultimoDia) }
}

export interface CelulaMes {
  chave: string
  dia: number | null
  hoje: boolean
}

export function montarGradeMes(ano: number, mes: number): CelulaMes[] {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
  const totalDias = new Date(ano, mes + 1, 0).getDate()
  const hoje = new Date()
  const chaveHoje = chaveDia(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())

  const celulas: CelulaMes[] = []
  for (let i = 0; i < primeiroDiaSemana; i++) {
    celulas.push({ chave: `vazio-inicio-${i}`, dia: null, hoje: false })
  }
  for (let dia = 1; dia <= totalDias; dia++) {
    const chave = chaveDia(ano, mes, dia)
    celulas.push({ chave, dia, hoje: chave === chaveHoje })
  }
  while (celulas.length % 7 !== 0) {
    celulas.push({ chave: `vazio-fim-${celulas.length}`, dia: null, hoje: false })
  }
  return celulas
}
