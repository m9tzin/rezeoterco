import type { TercoData, TipoTerco } from './types'
import { marianoData } from './mariano'
import { misericordiaData } from './misericordia'
import { novenaData } from './novenas'

export const TERCOS: Record<TipoTerco, TercoData> = {
  mariano: marianoData,
  misericordia: misericordiaData,
  novena: novenaData,
}

export const TERCO_LIST: TercoData[] = [marianoData, misericordiaData, novenaData]
