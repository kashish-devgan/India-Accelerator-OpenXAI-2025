import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b">
          <nav className="container flex items-center justify-between py-4">
            <Link href="/" className="font-semibold text-xl">MindfulCare</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/assess/phq9">PHQ-9</Link>
              <Link href="/assess/gad7">GAD-7</Link>
              <Link href="/assess/suicide">Suicide</Link>
              <Link href="/chat">Chat</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </nav>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="container text-xs text-gray-500 py-6">Not a medical device. For demo and research only.</footer>
      </body>
    </html>
  )
}
