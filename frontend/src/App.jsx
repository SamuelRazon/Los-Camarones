import Register from "./components/auth/pages/register/Register";
import Login from "./components/auth/pages/login/Login";
import Dashboard from "./pages/main/Dashboard";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./pages/notfound/NotFound";
import Docencia from "./components/category/Docencia";
import Modal from "./components/configuration/Modal";
{
  /*Extensión para usar el uso entre páginas*/
}
import { createBrowserRouter, RouterProvider } from "react-router-dom";

{
  /*Creado para invocar de las páginas, de acuerdo, a lo solicitado*/
}
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <div>
        <Register />
      </div>
    ),
  },
  {
    path: "/login",
    element: (
      <div>
        <Login />
      </div>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "*", //Ruta para páginas no encontradas
    element: <NotFound />,
  },
  {
    path: "*", //Ruta del componente de la página de inicio
    element: <Docencia />,
  },
  {
    path: "*", //Ruta del componente de la página de inicio
    element: <Modal />,
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} /> 
    </div> //Invocación de los cambios de la ruta 
  );
}

export default App;
