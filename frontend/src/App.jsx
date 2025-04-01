import { useState } from 'react'
import Inicioregistro from './pages/inicioregistro/inicioregistro'
import Registro from './components/registro'
import Login from './components/login'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Inicioregistro /></div>
  },
  {
    path: '/registro',
    element: <div><Registro /></div>
  },
  {
    path: '/login',
    element: <div><Login /></div>
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
