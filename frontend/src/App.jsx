import { useState } from 'react'
import Inicioregistro from './Componentes/Inicioregistro/inicioregistro'
import Registro from './Componentes/Inicioregistro/registro'
import Login from './Componentes/Inicioregistro/login'

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
