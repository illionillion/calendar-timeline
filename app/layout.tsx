import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Schedule Manager',
  description: 'タイムラインで簡単に予定を管理できるアプリ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
