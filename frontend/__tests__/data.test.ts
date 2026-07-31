import { marianoData } from '@/data/mariano'
import { TERCO_LIST, TERCOS } from '@/data/index'
import { novenaData } from '@/data/novenas'

describe('Terço Mariano', () => {
  it('has exactly 4 mysteries', () => {
    expect(marianoData.misterios).toHaveLength(4)
  })

  it('has correct mystery ids', () => {
    const ids = marianoData.misterios.map((m) => m.id)
    expect(ids).toEqual(['gozosos', 'dolorosos', 'gloriosos', 'luminosos'])
  })

  it('each mystery has exactly 77 etapas', () => {
    marianoData.misterios.forEach((misterio) => {
      expect(misterio.etapas).toHaveLength(77)
    })
  })

  it('each etapa has non-empty label and texto', () => {
    marianoData.misterios.forEach((misterio) => {
      misterio.etapas.forEach((etapa) => {
        expect(etapa.label.length).toBeGreaterThan(0)
        expect(etapa.texto.length).toBeGreaterThan(0)
      })
    })
  })

  it('first etapa of each mystery is the Credo', () => {
    marianoData.misterios.forEach((misterio) => {
      expect(misterio.etapas[0].tipo).toBe('credo')
    })
  })

  it('last etapa of each mystery is Salve Rainha', () => {
    marianoData.misterios.forEach((misterio) => {
      const last = misterio.etapas[misterio.etapas.length - 1]
      expect(last.tipo).toBe('salve-rainha')
    })
  })

  it('each mystery has 53 ave-maria etapas (3 initial + 5×10)', () => {
    marianoData.misterios.forEach((misterio) => {
      const aveMarias = misterio.etapas.filter((e) => e.tipo === 'ave-maria')
      expect(aveMarias).toHaveLength(53)
    })
  })
})

import { misericordiaData } from '@/data/misericordia'

describe('Terço da Divina Misericórdia', () => {
  it('has exactly 1 mystery sequence', () => {
    expect(misericordiaData.misterios).toHaveLength(1)
  })

  it('the single sequence has exactly 63 etapas', () => {
    expect(misericordiaData.misterios[0].etapas).toHaveLength(63)
  })

  it('each etapa has non-empty label and texto', () => {
    misericordiaData.misterios[0].etapas.forEach((etapa) => {
      expect(etapa.label.length).toBeGreaterThan(0)
      expect(etapa.texto.length).toBeGreaterThan(0)
    })
  })

  it('has 50 misericordia-paixao etapas (5 decades × 10)', () => {
    const paixao = misericordiaData.misterios[0].etapas.filter(
      (e) => e.tipo === 'misericordia-paixao'
    )
    expect(paixao).toHaveLength(50)
  })

  it('has 5 misericordia-oferta etapas (one per decade)', () => {
    const oferta = misericordiaData.misterios[0].etapas.filter(
      (e) => e.tipo === 'misericordia-oferta'
    )
    expect(oferta).toHaveLength(5)
  })

  it('starts with Pai Nosso, 3 Ave Marias, and Credo', () => {
    const abertura = misericordiaData.misterios[0].etapas.slice(0, 5)

    expect(abertura.map((etapa) => etapa.tipo)).toEqual([
      'pai-nosso',
      'ave-maria',
      'ave-maria',
      'ave-maria',
      'credo',
    ])
    expect(abertura.map((etapa) => etapa.label)).toEqual([
      'Pai Nosso',
      'Ave Maria 1/3',
      'Ave Maria 2/3',
      'Ave Maria 3/3',
      'Credo',
    ])
  })

  it('continues with 5 decades of oferta followed by 10 dolorosa paixao prayers', () => {
    const dezenas = misericordiaData.misterios[0].etapas.slice(5, 60)

    for (let decada = 0; decada < 5; decada++) {
      const inicio = decada * 11
      expect(dezenas[inicio].tipo).toBe('misericordia-oferta')
      expect(dezenas.slice(inicio + 1, inicio + 11).map((etapa) => etapa.tipo)).toEqual(
        Array(10).fill('misericordia-paixao')
      )
    }
  })

  it('ends with Deus Santo prayed 3 times', () => {
    const final = misericordiaData.misterios[0].etapas.slice(-3)

    expect(final.map((etapa) => etapa.tipo)).toEqual([
      'misericordia-final',
      'misericordia-final',
      'misericordia-final',
    ])
    expect(final.map((etapa) => etapa.label)).toEqual([
      'Deus Santo 1/3',
      'Deus Santo 2/3',
      'Deus Santo 3/3',
    ])
  })
})

describe('Novenas', () => {
  it('is available as a devotional type for selection', () => {
    expect(TERCO_LIST.map((terco) => terco.id)).toContain('novena')
    expect(TERCOS.novena).toBe(novenaData)
  })

  it('includes the requested novenas', () => {
    expect(novenaData.misterios.map((novena) => novena.id)).toEqual([
      'santa-terezinha',
      'santo-antonio',
      'nossa-senhora-das-gracas',
    ])
    expect(novenaData.misterios.map((novena) => novena.titulo)).toEqual([
      'Novena de Santa Terezinha',
      'Novena de Santo Antônio',
      'Novena de Nossa Senhora das Graças',
    ])
  })

  it('each novena has 9 non-empty day steps', () => {
    novenaData.misterios.forEach((novena) => {
      expect(novena.etapas).toHaveLength(9)
      expect(novena.etapas.map((etapa) => etapa.tipo)).toEqual(Array(9).fill('novena-dia'))
      novena.etapas.forEach((etapa, index) => {
        expect(etapa.label).toContain(`Dia ${index + 1}/9`)
        expect(etapa.texto.length).toBeGreaterThan(0)
      })
    })
  })
})
