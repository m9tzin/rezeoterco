import type { Etapa, TercoData } from './types'

const SINAL_DA_CRUZ =
  `Pelo sinal da Santa Cruz, livrai-nos, Deus, Nosso Senhor, dos nossos inimigos. Em nome do Pai, do Filho e do Espírito Santo. Amém.`

const CREDO =
  `Creio em Deus Pai todo-poderoso, criador do céu e da terra; e em Jesus Cristo, seu único Filho, Nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos; foi crucificado, morto e sepultado; desceu à mansão dos mortos; no terceiro dia ressuscitou dos mortos; subiu aos céus; está sentado à direita de Deus Pai todo-poderoso; d'onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo; na Santa Igreja Católica; na comunhão dos santos; na remissão dos pecados; na ressurreição da carne; e na vida eterna. Amém.`

const PAI_NOSSO =
  `Pai nosso que estais no céu, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`

const AVE_MARIA =
  `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`

const SALVE_RAINHA =
  `Salve Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva; a vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e depois deste desterro mostrai-nos Jesus, o fruto bendito do vosso ventre. Ó clemente! Ó piedosa! Ó doce sempre Virgem Maria! Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.`

const LIBERTACAO_CONTA_GRANDE =
  `Se, pois, o Filho vos libertar, sereis verdadeiramente livres. (Jo 8,36)`

const LIBERTACAO_CONTA_PEQUENA =
  `Jesus, tende piedade de mim! Jesus, curai-me! Jesus, salvai-me! Jesus, libertai-me!`

const CHAGAS_INICIAL =
  `Ó Jesus, Divino Redentor, tende misericórdia de nós e do mundo inteiro. Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro. Graça e misericórdia, meu Jesus; nos perigos presentes, cobri-nos com vosso preciosíssimo Sangue. Amém.`

const CHAGAS_CONTA_GRANDE =
  `Eterno Pai, eu Vos ofereço as Santas Chagas de Nosso Senhor Jesus Cristo, para curar as de nossas almas.`

const CHAGAS_CONTA_PEQUENA =
  `Meu Jesus, perdão e misericórdia, pelos méritos de Vossas Santas Chagas.`

function adicionarDezenas(
  etapas: Etapa[],
  contaGrande: { label: string; texto: string },
  contaPequena: { label: string; texto: string }
) {
  for (let decada = 1; decada <= 5; decada++) {
    etapas.push({
      tipo: 'conta-grande',
      label: `${contaGrande.label} — ${decada}ª Dezena`,
      texto: contaGrande.texto,
    })
    for (let i = 1; i <= 10; i++) {
      etapas.push({
        tipo: 'conta-pequena',
        label: `${contaPequena.label} ${i}/10`,
        texto: contaPequena.texto,
      })
    }
  }
}

function gerarLibertacaoEtapas(): Etapa[] {
  const etapas: Etapa[] = [
    { tipo: 'sinal-cruz', label: 'Sinal da Cruz', texto: SINAL_DA_CRUZ },
    { tipo: 'credo', label: 'Credo', texto: CREDO },
    { tipo: 'pai-nosso', label: 'Pai Nosso', texto: PAI_NOSSO },
    { tipo: 'ave-maria', label: 'Ave Maria', texto: AVE_MARIA },
  ]

  adicionarDezenas(
    etapas,
    { label: 'Palavra de Libertação', texto: LIBERTACAO_CONTA_GRANDE },
    { label: 'Oração de Libertação', texto: LIBERTACAO_CONTA_PEQUENA }
  )
  etapas.push({ tipo: 'salve-rainha', label: 'Salve Rainha', texto: SALVE_RAINHA })

  return etapas
}

function gerarSantasChagasEtapas(): Etapa[] {
  const etapas: Etapa[] = [
    { tipo: 'sinal-cruz', label: 'Sinal da Cruz', texto: SINAL_DA_CRUZ },
    { tipo: 'credo', label: 'Credo', texto: CREDO },
    { tipo: 'oracao-inicial', label: 'Oração Inicial', texto: CHAGAS_INICIAL },
  ]

  adicionarDezenas(
    etapas,
    { label: 'Oferecimento das Chagas', texto: CHAGAS_CONTA_GRANDE },
    { label: 'Perdão e Misericórdia', texto: CHAGAS_CONTA_PEQUENA }
  )
  for (let i = 1; i <= 3; i++) {
    etapas.push({
      tipo: 'oracao-final',
      label: `Oferecimento Final ${i}/3`,
      texto: CHAGAS_CONTA_GRANDE,
    })
  }

  return etapas
}

export const libertacaoData: TercoData = {
  id: 'libertacao',
  nome: 'Terço da Libertação',
  misterios: [
    {
      id: 'libertacao',
      titulo: 'Terço da Libertação',
      etapas: gerarLibertacaoEtapas(),
    },
  ],
}

export const santasChagasData: TercoData = {
  id: 'santas-chagas',
  nome: 'Terço das Santas Chagas',
  misterios: [
    {
      id: 'santas-chagas',
      titulo: 'Terço das Santas Chagas',
      etapas: gerarSantasChagasEtapas(),
    },
  ],
}
