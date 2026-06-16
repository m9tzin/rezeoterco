import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, EB_Garamond } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-eb-garamond',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Terço',
  description: 'Reze o terço de maneira simples, onde estiver.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Terço',
  },
}

export const viewport: Viewport = {
  themeColor: '#f7f2e8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${ebGaramond.variable} ${GeistSans.variable}`}
    >
      <body className="font-garamond bg-cream text-terco-text">{children}</body>
    </html>
  )
}
