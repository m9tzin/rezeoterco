export type TipoTerco = 'mariano' | 'misericordia' | 'novena'

export type TipoEtapa =
  | 'credo'
  | 'pai-nosso'
  | 'ave-maria'
  | 'gloria'
  | 'fatima'
  | 'salve-rainha'
  | 'anuncio'
  | 'misericordia-abertura'
  | 'misericordia-oferta'
  | 'misericordia-paixao'
  | 'misericordia-final'
  | 'novena-dia'

export type Etapa = {
  tipo: TipoEtapa
  label: string
  texto: string
}

export type Misterio = {
  id: string
  titulo: string
  etapas: Etapa[]
}

export type TercoData = {
  id: TipoTerco
  nome: string
  misterios: Misterio[]
}

export type Progress = {
  tipo: TipoTerco
  misterioId: string
  etapaIndex: number
}

export type FontSize = 'normal' | 'grande' | 'muito-grande'

export type Preferences = {
  fontSize: FontSize
}
