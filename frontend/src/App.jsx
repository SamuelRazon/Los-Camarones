import Register from "./components/auth/pages/register/Register";
import Login from "./components/auth/pages/login/Login";
import Dashboard from "./pages/main/Dashboard";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./pages/notfound/NotFound";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
/*import Docencia from "./components/category/Docencia";
import Modal from "./components/configuration/Modal";*/

import HomeRedirect from "./components/auth/pages/HomeRedirect";
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
    element: <HomeRedirect />,
  },
  {
    path: "/register",
    element: (
      <div>
        <RedirectIfAuthenticated>
          <Register />
        </RedirectIfAuthenticated>
      </div>
    ),
  },
  {
    path: "/login",
    element: (
      <div>
        <RedirectIfAuthenticated>
          <Login />
        </RedirectIfAuthenticated>
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
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div> //Invocación de los cambios de la ruta
  );
}

export default App;
