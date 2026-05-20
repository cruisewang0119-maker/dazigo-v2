import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist'
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: '搭子GO - 海外华人社交平台',
  description: '找搭子，一起吃喝玩乐！海外华人专属社交平台',
}

export const viewport: Viewport = {
  themeColor: '#B5AD8E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="bg-background">
      <body className={`${geist.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-background lg:flex lg:items-center lg:justify-center`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
