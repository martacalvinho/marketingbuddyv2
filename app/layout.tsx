import type { Metadata } from 'next'
import { Space_Grotesk, Outfit } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  display: 'swap',
})

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Marketing Buddy - AI Marketing Team',
  description: 'Your personal AI marketing team. We analyze your site, plan your week, and nag you until you hit publish.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${outfit.variable}`}>
      <body className="antialiased font-body">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
