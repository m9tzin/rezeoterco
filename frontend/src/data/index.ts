import type { TercoData, TipoTerco } from './types'
import { marianoData } from './mariano'
import { misericordiaData } from './misericordia'
import { libertacaoData, santasChagasData } from './devocionais'

export const TERCOS: Record<TipoTerco, TercoData> = {
  mariano: marianoData,
  misericordia: misericordiaData,
  libertacao: libertacaoData,
  'santas-chagas': santasChagasData,
}

export const TERCO_LIST: TercoData[] = [
  marianoData,
  misericordiaData,
  libertacaoData,
  santasChagasData,
]
