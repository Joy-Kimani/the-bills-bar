import { RouterProvider, createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import LandingScreen  from './pages/LandingScreen'
import MenuPage from './pages/MenuPage'
import EventsPage from './pages/EventsPage'
import ReserveTablePage from './pages/ReserveTablePage'

function App() {

  const router = createBrowserRouter([
    // Public routes
    {
      path: '/home',
      element: <Home/>
    },
    {
      path: '/',
      element: <LandingScreen/>
    },
    {
      path: '/menu',
      element: <MenuPage/>
    },
    {
      path: '/events',
      element:<EventsPage />
    },
    {
      path: '/reserve',
      element:<ReserveTablePage />
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
