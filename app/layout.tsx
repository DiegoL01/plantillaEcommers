import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '../components/providers/StoreProvider'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { LayoutClient } from '@/components/layout/LayoutClient'

export const metadata: Metadata = {
  title: 'Luxe - Compras Premium Online',
  description: 'Descubre productos premium seleccionados con cuidado. Compra en Luxe con garantía, envío rápido y atención al cliente 24/7.',
  generator: 'next.js',
  keywords: ['ecommerce', 'compras online', 'productos premium', 'tienda online'],
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
            <LayoutClient>{children}</LayoutClient>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
