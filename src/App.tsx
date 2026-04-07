import { useState, useEffect } from 'react'
import { AppRoutes } from './routes'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('luxe-dark-mode')
      if (saved !== null) {
        return JSON.parse(saved)
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('luxe-dark-mode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return <AppRoutes isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
}

export default App
