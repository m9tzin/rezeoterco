describe('PWA cache configuration', () => {
  it('pre-caches the static start URL for first-use offline support', async () => {
    const { pwaOptions } = await import('../pwa.config.mjs')

    expect(pwaOptions).toMatchObject({
      dest: 'public',
      cacheStartUrl: true,
      dynamicStartUrl: false,
      cacheOnFrontEndNav: true,
      aggressiveFrontEndNavCaching: true,
      reloadOnOnline: true,
    })
  })
})
