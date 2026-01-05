import type { Metadata } from 'next'
import { Manrope, IBM_Plex_Mono, Inter, Poppins, Montserrat, Open_Sans, Playfair_Display, Lora, Bebas_Neue, Oswald, Raleway, Merriweather, Source_Code_Pro } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const sansFont = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
})

// Carousel Designer Fonts
const interFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const poppinsFont = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const montserratFont = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const openSansFont = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

const playfairFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const loraFont = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const bebasFont = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  weight: ['400'],
})

const oswaldFont = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const ralewayFont = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const merriweatherFont = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['400', '700', '900'],
})

const sourceCodeFont = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

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
    <html lang="en" suppressHydrationWarning className={`${sansFont.variable} ${monoFont.variable} ${interFont.variable} ${poppinsFont.variable} ${montserratFont.variable} ${openSansFont.variable} ${playfairFont.variable} ${loraFont.variable} ${bebasFont.variable} ${oswaldFont.variable} ${ralewayFont.variable} ${merriweatherFont.variable} ${sourceCodeFont.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
