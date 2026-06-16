import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        garamond: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        serif: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        sans: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        body: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        geist: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#f7f2e8',
        parchment: '#ede4d0',
        brown: {
          DEFAULT: '#5c3d2e',
          dark: '#3d2519',
        },
        gold: {
          DEFAULT: '#9a7b3f',
          light: '#c9a85c',
          dark: '#7a6030',
        },
        'terco-text': '#2e1f10',
        'terco-muted': '#7a6248',
        'terco-red': '#8b2020',
      },
    },
  },
  plugins: [],
}

export default config
