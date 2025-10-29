import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'iPomodoro - Focus Better, Achieve More',
  description: 'A modern Pomodoro timer to boost your productivity and focus. Track your work sessions, break times, and productivity patterns.',
  keywords: ['pomodoro', 'timer', 'productivity', 'focus', 'time management'],
  authors: [{ name: 'iPomodoro Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'iPomodoro - Focus Better, Achieve More',
    description: 'A modern Pomodoro timer to boost your productivity and focus.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iPomodoro - Focus Better, Achieve More',
    description: 'A modern Pomodoro timer to boost your productivity and focus.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
