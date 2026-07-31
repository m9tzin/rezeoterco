import type { Etapa, TercoData } from './types'

const PAI_NOSSO =
  `Pai nosso que estais no céu, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`

const AVE_MARIA =
  `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`

const CREDO =
  `Creio em Deus Pai todo-poderoso, criador do céu e da terra; e em Jesus Cristo, seu único Filho, Nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos; foi crucificado, morto e sepultado; desceu à mansão dos mortos; no terceiro dia ressuscitou dos mortos; subiu aos céus; está sentado à direita de Deus Pai todo-poderoso; d'onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo; na Santa Igreja Católica; na comunhão dos santos; na remissão dos pecados; na ressurreição da carne; e na vida eterna. Amém.`

const OFERTA =
  `Pai Eterno, ofereço-Vos o Corpo e Sangue, a Alma e a Divindade de vosso muito amado Filho, Nosso Senhor Jesus Cristo, em reparação de nossos pecados e dos pecados do mundo inteiro.`

const PAIXAO =
  `Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro.`

const DEUS_SANTO =
  `Deus Santo! Deus Forte! Deus Imortal! Tende piedade de nós e do mundo inteiro.`

function gerarEtapas(): Etapa[] {
  const etapas: Etapa[] = []

  etapas.push({ tipo: 'pai-nosso', label: 'Pai Nosso', texto: PAI_NOSSO })
  for (let i = 1; i <= 3; i++) {
    etapas.push({ tipo: 'ave-maria', label: `Ave Maria ${i}/3`, texto: AVE_MARIA })
  }
  etapas.push({ tipo: 'credo', label: 'Credo', texto: CREDO })

  for (let decada = 1; decada <= 5; decada++) {
    etapas.push({
      tipo: 'misericordia-oferta',
      label: `Oferecimento — ${decada}ª Dezena`,
      texto: OFERTA,
    })
    for (let i = 1; i <= 10; i++) {
      etapas.push({
        tipo: 'misericordia-paixao',
        label: `Pela dolorosa Paixão ${i}/10`,
        texto: PAIXAO,
      })
    }
  }

  for (let i = 1; i <= 3; i++) {
    etapas.push({
      tipo: 'misericordia-final',
      label: `Deus Santo ${i}/3`,
      texto: DEUS_SANTO,
    })
  }

  return etapas
}

export const misericordiaData: TercoData = {
  id: 'misericordia',
  nome: 'Coroa da Divina Misericórdia',
  misterios: [
    {
      id: 'misericordia',
      titulo: 'Coroa da Divina Misericórdia',
      etapas: gerarEtapas(),
    },
  ],
}
