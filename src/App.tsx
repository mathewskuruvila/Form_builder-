import Logo from '@/components/Logo'
import { Toaster } from '@/components/ui/toaster'
import Home from './pages'
import axios from 'axios'
import Routes from './routes/routes'
import { useRoutes } from 'react-router-dom'
import routes from './routes/routes'
import Navbar from './components/Navbar'
import { ThemeProvider } from '@/components/providers/theme-provider'

export const AXIOS = axios.create({
  baseURL: "http://localhost:8000"
})
function App() {
  const content = useRoutes(routes)
  // return content
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
        <Navbar />
        <main className="flex w-full flex-grow">
          {content}
          {/* <Home />*/}
          <Toaster />
        </main>
      </div>

    </ThemeProvider>
  )

}

export default App
