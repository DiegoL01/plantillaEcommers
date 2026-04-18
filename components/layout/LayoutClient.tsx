'use client'

import { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface LayoutClientProps {
  children: React.ReactNode
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    
    const darkMode = stored ? stored === 'dark' : prefersDark
    setIsDarkMode(darkMode)
    setMounted(true)

    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev
      localStorage.setItem('theme', newMode ? 'dark' : 'light')
      
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      return newMode
    })
  }

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-16 bg-background border-b border-border" />
        <main className="flex-1">{children}</main>
        <div className="bg-card border-t border-border py-12" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
