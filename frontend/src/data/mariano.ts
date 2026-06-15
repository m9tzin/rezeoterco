import type { Etapa, Misterio, TercoData } from './types'

const CREDO = `Creio em Deus Pai todo-poderoso, criador do céu e da terra; e em Jesus Cristo, seu único Filho, Nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos; foi crucificado, morto e sepultado; desceu à mansão dos mortos; no terceiro dia ressuscitou dos mortos; subiu aos céus; está sentado à direita de Deus Pai todo-poderoso; d'onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo; na Santa Igreja Católica; na comunhão dos santos; na remissão dos pecados; na ressurreição da carne; e na vida eterna. Amém.`

const PAI_NOSSO = `Pai nosso que estais no céu, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`

const AVE_MARIA = `Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`

const GLORIA = `Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre, e pelos séculos dos séculos. Amém.`

const FATIMA = `Ó meu Jesus, perdoai-nos os nossos pecados, preservai-nos do fogo do inferno, levai as almas todas para o céu, especialmente as que mais precisarem da vossa misericórdia. Amém.`

const SALVE_RAINHA = `Salve Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva; a vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei; e depois deste desterro mostrai-nos Jesus, o fruto bendito do vosso ventre. Ó clemente! Ó piedosa! Ó doce sempre Virgem Maria! Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.`

type SubMisterio = { numero: number; titulo: string; anuncio: string }

function gerarEtapas(subMisterios: SubMisterio[]): Etapa[] {
  const etapas: Etapa[] = []

  etapas.push({ tipo: 'credo', label: 'Credo', texto: CREDO })
  etapas.push({ tipo: 'pai-nosso', label: 'Pai Nosso', texto: PAI_NOSSO })
  for (let i = 1; i <= 3; i++) {
    etapas.push({ tipo: 'ave-maria', label: `Ave Maria ${i}/3`, texto: AVE_MARIA })
  }
  etapas.push({ tipo: 'gloria', label: 'Glória', texto: GLORIA })

  subMisterios.forEach(({ numero, titulo, anuncio }) => {
    etapas.push({
      tipo: 'anuncio',
      label: `${numero}º Mistério — ${titulo}`,
      texto: anuncio,
    })
    etapas.push({ tipo: 'pai-nosso', label: 'Pai Nosso', texto: PAI_NOSSO })
    for (let i = 1; i <= 10; i++) {
      etapas.push({ tipo: 'ave-maria', label: `Ave Maria ${i}/10`, texto: AVE_MARIA })
    }
    etapas.push({ tipo: 'gloria', label: 'Glória', texto: GLORIA })
    etapas.push({ tipo: 'fatima', label: 'Oração de Fátima', texto: FATIMA })
  })

  etapas.push({ tipo: 'salve-rainha', label: 'Salve Rainha', texto: SALVE_RAINHA })

  return etapas
}

const GOZOSOS: Misterio = {
  id: 'gozosos',
  titulo: 'Mistérios Gozosos',
  etapas: gerarEtapas([
    {
      numero: 1,
      titulo: 'A Anunciação',
      anuncio: `Primeiro Mistério Gozoso: A Anunciação do Anjo a Maria.\n\nO Arcanjo Gabriel anuncia a Maria que ela conceberá o Filho de Deus pelo poder do Espírito Santo. Maria responde com humildade e fé: "Eis a serva do Senhor; faça-se em mim segundo a tua palavra." (Lc 1,38)\n\nPeçamos a graça da humildade e da fé.`,
    },
    {
      numero: 2,
      titulo: 'A Visitação',
      anuncio: `Segundo Mistério Gozoso: A Visitação de Nossa Senhora a Santa Isabel.\n\nMaria visita sua prima Isabel, que, ao ouvi-la, exclama: "Bendita és tu entre as mulheres e bendito é o fruto do teu ventre!" (Lc 1,42)\n\nPeçamos a graça do amor ao próximo e da caridade.`,
    },
    {
      numero: 3,
      titulo: 'O Nascimento de Jesus',
      anuncio: `Terceiro Mistério Gozoso: O Nascimento de Jesus em Belém.\n\nJesus nasce numa manjedoura, envolto em faixas. Os anjos anunciam aos pastores: "Glória a Deus nas alturas e paz na terra aos homens de boa vontade!" (Lc 2,14)\n\nPeçamos a graça da simplicidade e do desapego dos bens materiais.`,
    },
    {
      numero: 4,
      titulo: 'A Apresentação no Templo',
      anuncio: `Quarto Mistério Gozoso: A Apresentação de Jesus no Templo.\n\nMaria e José apresentam o menino Jesus no Templo. O ancião Simeão o recebe nos braços e proclama: "Meus olhos viram a salvação que preparaste." (Lc 2,30)\n\nPeçamos a graça da obediência e da fidelidade a Deus.`,
    },
    {
      numero: 5,
      titulo: 'O Encontro no Templo',
      anuncio: `Quinto Mistério Gozoso: O Encontro de Jesus no Templo.\n\nApós três dias de angustiosa busca, Maria e José encontram Jesus no Templo, ensinando os doutores. Ele diz: "Não sabíeis que eu devia estar nas coisas de meu Pai?" (Lc 2,49)\n\nPeçamos a graça de buscar sempre a Deus em nossa vida.`,
    },
  ]),
}

const DOLOROSOS: Misterio = {
  id: 'dolorosos',
  titulo: 'Mistérios Dolorosos',
  etapas: gerarEtapas([
    {
      numero: 1,
      titulo: 'A Agonia no Horto',
      anuncio: `Primeiro Mistério Doloroso: A Agonia de Jesus no Horto das Oliveiras.\n\nJesus, cheio de angústia, ora prostrado: "Pai, se possível, afaste de mim este cálice; porém não se faça a minha vontade, mas a tua." (Mt 26,39) Suor de sangue cobre seu rosto.\n\nPeçamos a graça da contrição pelos nossos pecados.`,
    },
    {
      numero: 2,
      titulo: 'A Flagelação',
      anuncio: `Segundo Mistério Doloroso: A Flagelação de Jesus.\n\nJesus é preso, entregue a Pilatos e, embora inocente, é cruelmente açoitado pelos soldados. Ele suporta tudo em silêncio, oferecendo seu sofrimento pela nossa redenção.\n\nPeçamos a graça da mortificação e do domínio sobre nós mesmos.`,
    },
    {
      numero: 3,
      titulo: 'A Coroação de Espinhos',
      anuncio: `Terceiro Mistério Doloroso: A Coroação de Espinhos.\n\nOs soldados entrançam uma coroa de espinhos e a colocam na cabeça de Jesus, jogam-lhe um manto vermelho e zombam d'Ele: "Salve, Rei dos Judeus!" (Jo 19,3)\n\nPeçamos a graça da coragem para defender a nossa fé.`,
    },
    {
      numero: 4,
      titulo: 'Jesus Carrega a Cruz',
      anuncio: `Quarto Mistério Doloroso: Jesus Carrega a Cruz.\n\nJesus carrega a pesada cruz até o Calvário, caindo três vezes sob seu peso. Maria acompanha seu Filho no caminho da dor. Simão Cireneu é obrigado a ajudá-lo a carregar a cruz.\n\nPeçamos a graça de aceitar com amor as cruzes da nossa vida.`,
    },
    {
      numero: 5,
      titulo: 'A Crucificação e Morte de Jesus',
      anuncio: `Quinto Mistério Doloroso: A Crucificação e Morte de Jesus.\n\nJesus é pregado na cruz entre dois ladrões. Após três horas de agonia, inclina a cabeça e entrega o espírito. Um soldado abre seu lado com uma lança, e jorra sangue e água. (Jo 19,34)\n\nPeçamos a graça de um amor generoso a Deus e ao próximo.`,
    },
  ]),
}

const GLORIOSOS: Misterio = {
  id: 'gloriosos',
  titulo: 'Mistérios Gloriosos',
  etapas: gerarEtapas([
    {
      numero: 1,
      titulo: 'A Ressurreição',
      anuncio: `Primeiro Mistério Glorioso: A Ressurreição de Jesus.\n\nNo terceiro dia, Jesus ressuscita glorioso e imortal. O anjo diz às mulheres: "Ele não está aqui; ressuscitou, como havia dito." (Mt 28,6)\n\nPeçamos a graça da fé viva e da esperança na vida eterna.`,
    },
    {
      numero: 2,
      titulo: 'A Ascensão ao Céu',
      anuncio: `Segundo Mistério Glorioso: A Ascensão de Jesus ao Céu.\n\nQuarenta dias após a Ressurreição, Jesus sobe ao Céu à vista dos apóstolos e promete: "E eu estou convosco todos os dias, até o fim dos tempos." (Mt 28,20)\n\nPeçamos a graça do desejo do Céu e das coisas eternas.`,
    },
    {
      numero: 3,
      titulo: 'A Vinda do Espírito Santo',
      anuncio: `Terceiro Mistério Glorioso: A Vinda do Espírito Santo (Pentecostes).\n\nO Espírito Santo desce sobre Maria e os apóstolos no cenáculo em forma de línguas de fogo. Cheios do Espírito, saem a anunciar o Evangelho a todas as nações. (At 2,4)\n\nPeçamos a graça dos dons do Espírito Santo.`,
    },
    {
      numero: 4,
      titulo: 'A Assunção de Maria',
      anuncio: `Quarto Mistério Glorioso: A Assunção de Nossa Senhora ao Céu.\n\nAo fim de sua vida terrena, a Virgem Maria, preservada de todo pecado, é elevada ao Céu em corpo e alma, para participar da glória do seu Filho ressuscitado.\n\nPeçamos a graça de uma morte santa e a esperança da ressurreição.`,
    },
    {
      numero: 5,
      titulo: 'A Coroação de Nossa Senhora',
      anuncio: `Quinto Mistério Glorioso: A Coroação de Nossa Senhora Rainha do Céu e da Terra.\n\nNossa Senhora é coroada Rainha de todo o universo pelo seu Filho Jesus, reinando com Ele para sempre. Ela intercede por todos os seus filhos na terra.\n\nPeçamos a graça da perseverança final e a devoção a Maria.`,
    },
  ]),
}

const LUMINOSOS: Misterio = {
  id: 'luminosos',
  titulo: 'Mistérios Luminosos',
  etapas: gerarEtapas([
    {
      numero: 1,
      titulo: 'O Batismo no Jordão',
      anuncio: `Primeiro Mistério Luminoso: O Batismo de Jesus no Jordão.\n\nJesus é batizado por João no rio Jordão. Os céus se abrem e uma voz proclama: "Este é o meu Filho amado, em quem tenho todo o meu agrado." (Mt 3,17)\n\nPeçamos a graça de viver plenamente nosso Batismo.`,
    },
    {
      numero: 2,
      titulo: 'As Bodas de Caná',
      anuncio: `Segundo Mistério Luminoso: As Bodas de Caná.\n\nA pedido de Maria, Jesus realiza seu primeiro milagre, transformando água em vinho. Maria diz aos serventes: "Fazei o que Ele vos disser." (Jo 2,5)\n\nPeçamos a graça de recorrer sempre a Maria em nossas necessidades.`,
    },
    {
      numero: 3,
      titulo: 'O Anúncio do Reino de Deus',
      anuncio: `Terceiro Mistério Luminoso: O Anúncio do Reino de Deus.\n\nJesus percorre cidades e aldeias proclamando: "Convertei-vos e crede no Evangelho." (Mc 1,15) Ele cura os doentes, perdoa os pecadores e chama todos à conversão.\n\nPeçamos a graça da conversão e da abertura à Palavra de Deus.`,
    },
    {
      numero: 4,
      titulo: 'A Transfiguração',
      anuncio: `Quarto Mistério Luminoso: A Transfiguração de Jesus.\n\nNo Monte Tabor, Jesus se transfigura diante de Pedro, Tiago e João. Seu rosto brilha como o sol e uma voz do céu diz: "Este é o meu Filho amado; escutai-o." (Mt 17,5)\n\nPeçamos a graça de contemplar a glória de Deus e desejar a santidade.`,
    },
    {
      numero: 5,
      titulo: 'A Instituição da Eucaristia',
      anuncio: `Quinto Mistério Luminoso: A Instituição da Eucaristia.\n\nNa Última Ceia, Jesus toma o pão e o cálice e diz: "Isto é o meu corpo... Este é o cálice do meu sangue." (Lc 22,19-20) Ele nos deixa o maior dos sacramentos.\n\nPeçamos a graça de uma devoção profunda à Eucaristia.`,
    },
  ]),
}

export const marianoData: TercoData = {
  id: 'mariano',
  nome: 'Terço Mariano',
  misterios: [GOZOSOS, DOLOROSOS, GLORIOSOS, LUMINOSOS],
}
