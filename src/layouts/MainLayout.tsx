import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ToastContainer } from '../components/ui/Toast'

interface MainLayoutProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const MainLayout = ({ isDarkMode, toggleDarkMode }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
