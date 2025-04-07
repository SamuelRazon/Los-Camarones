import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Dashboard from './pages/main/Dashboard'
import PrivateRoute from './components/auth/PrivateRoute'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
  )},
  {
    path: '/Register',
    element: <div><Register /></div>
  },
  {
    path: '/Login',
    element: <div><Login /></div>
  },
  {
    path: '/Dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    )
  }
])

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
};

export default App;
