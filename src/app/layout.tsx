import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Video Generator',
  description: 'Create stunning videos with AI using advanced text-to-video generation',
  keywords: ['AI', 'video generation', 'text-to-video', 'artificial intelligence'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Video Generator
                  </h1>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    Powered by Veo-3
                  </span>
                </div>
                
                <nav className="flex items-center space-x-6">
                  <a 
                    href="/" 
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                  >
                    Generate
                  </a>
                  <a 
                    href="/history" 
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
                  >
                    History
                  </a>
                  <button 
                    className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                    title="Toggle theme"
                  >
                    🌙
                  </button>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-slate-600 dark:text-slate-400">
                <p className="mb-2">
                  Create professional videos with AI-powered generation
                </p>
                <p className="text-sm">
                  Advanced video synthesis using state-of-the-art models
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}