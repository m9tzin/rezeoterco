# Terço — Design Spec
**Data:** 2026-06-15  
**Status:** Aprovado

---

## Visão Geral

Website para rezar o terço de maneira simples, acessível e offline-first. Voltado tanto para usuários experientes quanto para quem está iniciando na vida católica. Funciona em desktop e mobile. Após o primeiro acesso, funciona sem internet.

---

## Stack Técnico

| Componente | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| PWA / Offline | `next-pwa` com Workbox (Service Worker) |
| Estilização | Tailwind CSS |
| Fonte das orações | Lora (Google Fonts, serifada) |
| Fonte da UI | Inter ou system-ui (sans-serif) |
| Persistência | `localStorage` (progresso + preferência de fonte) |
| Hospedagem alvo | Vercel ou qualquer host estático |

Todo o conteúdo das orações é estático (TypeScript puro) — sem chamadas de API, 100% offline.

---

## Telas e Fluxo

O app é uma única página Next.js com estado controlado no cliente. Três telas são renderizadas condicionalmente:

### Tela 1 — Seleção

- Mostra o tipo de terço ativo (padrão: **Terço Mariano**) com opção de trocar entre tipos disponíveis
- Lista os mistérios disponíveis para o tipo selecionado:
  - Mariano: Gozosos · Dolorosos · Gloriosos · Luminosos
  - Misericórdia: sequência única
- Se houver progresso salvo no `localStorage`, exibe banner de retomada:
  > "Você parou no 2º Mistério Gozoso — continuar de onde parou?"
  - Botões: **Continuar** / **Começar do zero**

### Tela 2 — Reza (tela principal)

- Layout de coluna única, centralizado, sem distrações
- **Cabeçalho fixo:** nome do mistério + indicador de progresso (ex: "1º Mistério Gozoso · Ave Maria 3/10")
- **Centro:** texto completo da oração atual em fonte serifada, tamanho ajustável
- **Botões de fonte:** `−A` e `+A` fixos na lateral direita, sempre visíveis
- **Rodapé:** botão "Próximo" (grande, área mínima de 56px) + botão "Anterior" (menor, secundário)
- Navegação por teclado: `→` ou `Space` avança, `←` volta
- Fade suave entre orações (transition CSS simples)
- Progresso salvo automaticamente no `localStorage` a cada avanço

### Tela 3 — Conclusão

- Mensagem simples ao terminar o terço
- Opções: **Rezar outro mistério** / **Voltar ao início**
- Ao confirmar nova sessão, progresso salvo é limpo

---

## Estrutura de Dados das Orações

```typescript
type TipoTerco = 'mariano' | 'misericordia'

type Etapa = {
  tipo: 'credo' | 'pai-nosso' | 'ave-maria' | 'gloria' | 'fatima' | 'salve-rainha' | 'anuncio' | 'oracao-misericordia'
  label: string        // exibido no cabeçalho (ex: "Ave Maria 3/10")
  texto: string        // oração completa em português
  misterioNumero?: number  // 1–5, presente nos anúncios
  misterioTitulo?: string  // ex: "A Anunciação do Anjo a Maria"
}

type Misterio = {
  id: string           // ex: 'gozosos'
  titulo: string       // ex: 'Mistérios Gozosos'
  etapas: Etapa[]
}

type TercoData = {
  id: TipoTerco
  nome: string
  misterios: Misterio[]
}
```

### Sequência do Terço Mariano por mistério

Cada mistério segue esta ordem:

1. Credo (apenas no primeiro mistério, no início do terço completo)
2. Pai Nosso inicial
3. 3× Ave Maria (pelas virtudes fé, esperança e caridade)
4. Glória
5. **Repetir 5 vezes (um por submistério):**
   - Anúncio do mistério
   - Pai Nosso
   - 10× Ave Maria
   - Glória
   - Oração de Fátima
6. Salve Rainha (ao final do 5º submistério)

Os dados de cada tipo de terço vivem em arquivos separados (`/src/data/mariano.ts`, `/src/data/misericordia.ts`) sem impacto na lógica de navegação.

---

## Ajuste de Fonte

Três níveis, aplicados como classe CSS no elemento raiz:

| Nível | Tamanho do texto das orações |
|---|---|
| Normal | 18px |
| Grande | 22px |
| Muito Grande | 28px |

Salvo em `localStorage` como `{ fontSize: 'normal' | 'grande' | 'muito-grande' }`. Aplicado imediatamente na sessão e restaurado no próximo acesso.

---

## Persistência (localStorage)

Chave: `terco-progress`

```typescript
type Progress = {
  tipo: TipoTerco
  misterioId: string
  etapaIndex: number
}
```

Chave: `terco-preferences`

```typescript
type Preferences = {
  fontSize: 'normal' | 'grande' | 'muito-grande'
}
```

---

## PWA e Offline

- `next-pwa` configurado em `next.config.js` para gerar Service Worker via Workbox
- Cache strategy: **CacheFirst** para assets estáticos, **NetworkFirst** para navegação
- Manifesto (`manifest.json`): nome, ícone, `display: standalone`, cor de tema off-white
- Após primeiro acesso, o app funciona 100% offline
- Instalável como app no celular (ícone na tela inicial, sem barra do browser)

---

## Visual e Acessibilidade

**Paleta:**
- Fundo: `#FAF9F6` (off-white quente)
- Texto principal: `#1C1C1E` (quase preto)
- Texto secundário: `#6B7280` (cinza médio)
- Destaque/acento: `#8B7355` (bege-dourado suave, remetendo ao religioso)
- Bordas e separadores: `#E5E7EB`

**Tipografia:**
- Orações: Lora (serifada, elegante, legível)
- UI (labels, botões, cabeçalho): Inter ou system-ui

**Responsividade:**
- Layout de coluna única, centralizado
- Largura máxima: 680px no desktop
- Botão "Próximo": área mínima de 56px de altura
- Testado para uso com uma mão no mobile

**Sem animações pesadas** — apenas `transition: opacity 200ms ease` entre orações.

---

## Tipos de Terço Disponíveis

| Tipo | Descrição |
|---|---|
| Mariano (padrão) | Terço tradicional com 4 mistérios de 5 submistérios cada |
| Misericórdia | Terço da Divina Misericórdia (estrutura própria) |

Novos tipos podem ser adicionados como novos arquivos de dados em `/src/data/` sem alterar a lógica de navegação.

---

## O que está fora do escopo

- Áudio / narração das orações
- Autenticação ou sincronização entre dispositivos
- Histórico de terços rezados
- Modo noturno (pode ser adicionado no futuro)
- Internacionalização (somente português por ora)
