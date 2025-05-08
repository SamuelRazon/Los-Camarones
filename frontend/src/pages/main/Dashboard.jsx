import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Top from "../../components/layout/Top";
import Sidebar from "../../components/layout/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faBars } from "@fortawesome/free-solid-svg-icons";
import useTokenAutoVerifier from "../../hooks/useTokenAutoVerifier";
import TokenExpiryToast from "../../components/auth/TokenExpiryToast";
import Loader from "../../components/Loader";
import documentService from "../../services/documentServices";

const Dashboard = () => {
  useTokenAutoVerifier();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false); // 👈 Se agrega el estado

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="dashboard">
      <header>
        <Top isConfigOpen={isConfigOpen} setIsConfigOpen={setIsConfigOpen} />{" "}
        {/* 👈 Se pasan las props */}
      </header>

      <aside>
        <Sidebar
          setCategoriaSeleccionada={setCategoriaSeleccionada}
          setDocuments={setDocuments}
        />
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
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">
                  <Loader />
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="3">No hay documentos disponibles.</td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.nombre}</td>
                  <td>{doc.fecha}</td>
                  <td>{doc.rubro}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TokenExpiryToast />
    </div>
  );
};

export default Dashboard;
