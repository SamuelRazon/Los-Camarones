import React, { useState } from "react";
import "./Dashboard.css";
import Top from "../../components/layout/Top";
import Sidebar from "../../components/layout/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faBars } from "@fortawesome/free-solid-svg-icons";
import useTokenAutoVerifier from "../../hooks/useTokenAutoVerifier";
import TokenExpiryToast from "../../components/auth/TokenExpiryToast";

/* Dedicado a dar el diseño de la página principal, con los respectivos modales que se iran
 * integrando sobre el proceso de cada botón o estilo que tenga cada componente */

/** Inovación para la creación de los modales*/
const Dashboard = () => {
  useTokenAutoVerifier(); // Hook para verificar el token automáticamente`

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div className="dashboard">
      <header>
        <Top isConfigOpen={isConfigOpen} setIsConfigOpen={setIsConfigOpen} />
      </header>
      <aside>
        <Sidebar />
      </aside>
      <div className="dashboard-main">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Rubro</th>
            </tr>
          </thead>
          <tbody>{/* Aquí irán las filas dinámicas */}</tbody>
        </table>
      </div>
      <TokenExpiryToast />
    </div>
  );
};
export default Dashboard;
