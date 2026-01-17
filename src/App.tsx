import { RouterProvider, createBrowserRouter } from 'react-router'
import Home from './pages/Home'
import LandingScreen  from './pages/LandingScreen'
import MenuPage from './pages/MenuPage'
import EventsPage from './pages/EventsPage'
import ReserveTablePage from './pages/ReserveTablePage'
import Overview from './pages/Admin.tsx/Overview'
import Analytics from './pages/Admin.tsx/Analytics'
import StaffManagement from './pages/Admin.tsx/StaffManagement'
import ReservedTables from './pages/Admin.tsx/ReservedTables'
import MenuItems from './pages/Admin.tsx/MenuItems'
import AllOrders from './pages/Admin.tsx/AllOrders'
import AllEvents from './pages/Admin.tsx/AllEvents'

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
    },
    {
      path: '/admin/overview',
      element: <Overview/>
    },
    {
      path: '/admin/staff',
      element: <StaffManagement/>
    },
    {
      path: '/admin/tables',
      element: <ReservedTables/>
    },
    {
      path: '/admin/menu',
      element: <MenuItems/>
    },
    {
      path: '/admin/analytics',
      element: <Analytics/>
    },
    {
      path: '/admin/orders',
      element: <AllOrders/>
    },
    {
       path: '/admin/events',
      element: <AllEvents/>
    }

  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
