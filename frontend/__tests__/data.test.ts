import { marianoData } from '@/data/mariano'

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
