import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { RestaurantProvider } from '@/contexts/RestaurantContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Swipe Eats',
  description: 'Swipe Eats',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RestaurantProvider>{children}</RestaurantProvider>
      </body>
    </html>
  )
}
