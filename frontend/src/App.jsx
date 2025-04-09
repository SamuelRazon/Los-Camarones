import Register from "./components/auth/pages/register/Register";
import Login from "./components/auth/pages/login/Login";
import Dashboard from "./pages/main/Dashboard";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./pages/notfound/NotFound";
import Docencia from "./components/category/Docencia";
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
    path: "*", //Ruta para páginas no encontradas
    element: <Docencia />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
