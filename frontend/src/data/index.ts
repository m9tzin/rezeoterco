import type { TercoData, TipoTerco } from './types'
import { marianoData } from './mariano'
import { misericordiaData } from './misericordia'

export const TERCOS: Record<TipoTerco, TercoData> = {
  mariano: marianoData,
  misericordia: misericordiaData,
}

export const TERCO_LIST: TercoData[] = [marianoData, misericordiaData]
