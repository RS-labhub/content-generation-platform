import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Content Generation Platform',
  description: 'Generate platform-specific posts with AI-powered contextual optimization',
  generator: 'Rohan Sharma',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Content Generation Platform',
    siteName: 'content-generator',
    url: 'https://content-generator.vercel.app/',
    description:
      'Generate platform-specific posts with AI-powered contextual optimization',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Content Generation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content Generation Platform',
    description:
      'Generate platform-specific posts with AI-powered contextual optimization',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
