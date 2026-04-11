import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '../components/providers/StoreProvider'
import { ThemeProvider } from '../components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Luxe - E-commerce Premium',
  description: 'Discover premium products with Luxe ecommerce',
  generator: 'next.js',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
