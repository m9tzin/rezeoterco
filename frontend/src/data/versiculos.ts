export type VersiculoDoDia = {
  referencia: string
  texto: string
  reflexao: string
}

export const VERSICULOS_DO_DIA: VersiculoDoDia[] = [
  {
    referencia: 'Salmo 23,1',
    texto: 'O Senhor é meu pastor; nada me faltará.',
    reflexao: 'Comece o dia confiando que Deus guia seus passos e cuida do necessário.',
  },
  {
    referencia: 'João 14,6',
    texto: 'Eu sou o caminho, a verdade e a vida.',
    reflexao: 'Volte seu coração para Cristo nas escolhas concretas de hoje.',
  },
  {
    referencia: 'Filipenses 4,13',
    texto: 'Tudo posso naquele que me fortalece.',
    reflexao: 'A força para perseverar nasce da graça de Deus, não apenas do esforço próprio.',
  },
  {
    referencia: 'Mateus 5,8',
    texto: 'Bem-aventurados os puros de coração, porque verão a Deus.',
    reflexao: 'Peça a graça de olhar pessoas e situações com simplicidade e retidão.',
  },
  {
    referencia: 'Romanos 12,12',
    texto: 'Alegrai-vos na esperança, sede pacientes na tribulação.',
    reflexao: 'A esperança cristã ajuda a atravessar as dificuldades sem perder a paz.',
  },
  {
    referencia: 'Salmo 46,11',
    texto: 'Aquietai-vos e sabei que eu sou Deus.',
    reflexao: 'Reserve um instante de silêncio para entregar a Deus suas inquietações.',
  },
  {
    referencia: 'Lucas 1,38',
    texto: 'Eis aqui a serva do Senhor.',
    reflexao: 'Como Maria, responda a Deus com disponibilidade no dever de hoje.',
  },
  {
    referencia: 'Mateus 11,28',
    texto: 'Vinde a mim todos os que estais cansados.',
    reflexao: 'Leve a Jesus seus pesos antes de carregá-los sozinho.',
  },
  {
    referencia: '1 João 4,19',
    texto: 'Nós amamos porque Ele nos amou primeiro.',
    reflexao: 'Deixe-se amar por Deus para amar melhor quem está perto de você.',
  },
  {
    referencia: 'Provérbios 3,5',
    texto: 'Confia no Senhor de todo o teu coração.',
    reflexao: 'A confiança amadurece quando entregamos também aquilo que não controlamos.',
  },
  {
    referencia: 'Salmo 119,105',
    texto: 'Tua palavra é lâmpada para os meus pés.',
    reflexao: 'Permita que a Palavra ilumine o próximo passo, mesmo que o caminho inteiro ainda não apareça.',
  },
  {
    referencia: 'Colossenses 3,15',
    texto: 'Que a paz de Cristo reine em vossos corações.',
    reflexao: 'Antes de agir, procure a paz que vem de Cristo e conduz à caridade.',
  },
  {
    referencia: 'Isaías 41,10',
    texto: 'Não temas, porque eu sou contigo.',
    reflexao: 'A presença de Deus é maior que o medo que tenta paralisar você.',
  },
  {
    referencia: 'Mateus 6,33',
    texto: 'Buscai primeiro o Reino de Deus.',
    reflexao: 'Organize o dia a partir do que aproxima seu coração de Deus.',
  },
]

export function getDiaDoAno(date: Date): number {
  const startOfYear = Date.UTC(date.getFullYear(), 0, 1)
  const currentDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

  return Math.floor((currentDay - startOfYear) / 86_400_000)
}

export function getVersiculoDoDia(date = new Date()): VersiculoDoDia {
  return VERSICULOS_DO_DIA[getDiaDoAno(date) % VERSICULOS_DO_DIA.length]
}
