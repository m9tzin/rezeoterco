import type { Etapa, TercoData } from './types'
import { AVE_MARIA, GLORIA, PAI_NOSSO } from './mariano'

type NovenaDia = {
  tema: string
  intencao: string
}

const NOVENAS: Array<{
  id: string
  titulo: string
  invocacao: string
  dias: NovenaDia[]
}> = [
  {
    id: 'santa-terezinha',
    titulo: 'Novena de Santa Terezinha',
    invocacao:
      'Santa Terezinha do Menino Jesus, ensinai-nos o caminho da confiança simples e do amor fiel nas pequenas coisas de cada dia.',
    dias: [
      { tema: 'Confiança', intencao: 'Aumentai em nós a confiança no amor misericordioso de Deus.' },
      { tema: 'Humildade', intencao: 'Concedei-nos um coração simples, livre de orgulho e vaidade.' },
      { tema: 'Pequeno caminho', intencao: 'Ajudai-nos a servir com alegria nas tarefas pequenas e escondidas.' },
      { tema: 'Amor a Jesus', intencao: 'Fazei crescer em nós um amor sincero e perseverante por Jesus.' },
      { tema: 'Paciência', intencao: 'Ensinai-nos a carregar as contrariedades com paz e esperança.' },
      { tema: 'Caridade', intencao: 'Tornai-nos atentos às necessidades dos irmãos.' },
      { tema: 'Oração', intencao: 'Alcançai-nos fidelidade na oração diária.' },
      { tema: 'Esperança', intencao: 'Renovai nossa esperança nas promessas de Cristo.' },
      { tema: 'Entrega', intencao: 'Ajudai-nos a entregar nossa vida nas mãos do Pai.' },
    ],
  },
  {
    id: 'santo-antonio',
    titulo: 'Novena de Santo Antônio',
    invocacao:
      'Santo Antônio, amigo dos pobres e pregador do Evangelho, intercedei por nós junto a Jesus Cristo.',
    dias: [
      { tema: 'Fé', intencao: 'Fortalecei nossa fé para seguirmos Cristo com coragem.' },
      { tema: 'Palavra de Deus', intencao: 'Abri nosso coração para ouvir e praticar o Evangelho.' },
      { tema: 'Caridade com os pobres', intencao: 'Dai-nos generosidade para socorrer quem precisa.' },
      { tema: 'Pureza de coração', intencao: 'Guardai nossos pensamentos, palavras e ações no amor de Deus.' },
      { tema: 'Família', intencao: 'Protegei nossas famílias e restaurai a paz em nossos lares.' },
      { tema: 'Trabalho', intencao: 'Intercedei por quem busca trabalho, sustento e dignidade.' },
      { tema: 'Reconciliação', intencao: 'Ajudai-nos a perdoar e reconstruir relações feridas.' },
      { tema: 'Sabedoria', intencao: 'Orientai nossas decisões segundo a vontade de Deus.' },
      { tema: 'Gratidão', intencao: 'Ensinai-nos a reconhecer e agradecer as graças recebidas.' },
    ],
  },
  {
    id: 'nossa-senhora-das-gracas',
    titulo: 'Novena de Nossa Senhora das Graças',
    invocacao:
      'Nossa Senhora das Graças, Mãe da Medalha Milagrosa, rogai por nós que recorremos a vós.',
    dias: [
      { tema: 'Acolhida de Maria', intencao: 'Acolhei nossas necessidades e conduzi-nos ao vosso Filho.' },
      { tema: 'Conversão', intencao: 'Alcançai-nos a graça de voltar o coração para Deus.' },
      { tema: 'Confiança', intencao: 'Ajudai-nos a confiar na Providência em todos os momentos.' },
      { tema: 'Proteção', intencao: 'Guardai-nos sob vosso cuidado materno.' },
      { tema: 'Cura interior', intencao: 'Intercedei pela cura das feridas que carregamos.' },
      { tema: 'Paz', intencao: 'Derramai paz sobre nossas famílias e comunidades.' },
      { tema: 'Perseverança', intencao: 'Sustentai nossa caminhada de fé até o fim.' },
      { tema: 'Serviço', intencao: 'Fazei-nos disponíveis para servir com amor.' },
      { tema: 'Graças necessárias', intencao: 'Obtende-nos as graças que nos aproximam de Deus.' },
    ],
  },
]

function gerarDias(invocacao: string, dias: NovenaDia[]): Etapa[] {
  return dias.flatMap((dia, index) => [
    {
      tipo: 'novena-dia',
      label: `Dia ${index + 1}/9 — ${dia.tema}`,
      texto: `${invocacao}\n\n${dia.intencao}\n\nAmém.`,
    },
    { tipo: 'pai-nosso', label: 'Pai Nosso', texto: PAI_NOSSO },
    { tipo: 'ave-maria', label: 'Ave Maria', texto: AVE_MARIA },
    { tipo: 'gloria', label: 'Glória', texto: GLORIA },
  ])
}

export const novenaData: TercoData = {
  id: 'novena',
  nome: 'Novenas',
  misterios: NOVENAS.map((novena) => ({
    id: novena.id,
    titulo: novena.titulo,
    etapas: gerarDias(novena.invocacao, novena.dias),
  })),
}
