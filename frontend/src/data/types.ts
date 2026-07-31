export type TipoTerco =
  | 'mariano'
  | 'misericordia'
  | 'libertacao'
  | 'santas-chagas'
  | 'novena'

export type TipoEtapa =
  | 'sinal-cruz'
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
  | 'oracao-inicial'
  | 'conta-grande'
  | 'conta-pequena'
  | 'oracao-final'
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
