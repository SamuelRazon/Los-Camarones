import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";
import Top from "../../components/layout/Top";
import Sidebar from "../../components/layout/Sidebar";
import useTokenAutoVerifier from "../../hooks/useTokenAutoVerifier";
import Loader from "../../components/Loader";
import documentService from "../../services/documentServices";
import categoryService from "../../services/categoryServices";
import UpdateDocument from "../../components/configuration/documents/updatedocument/UpdateDocument";

const Dashboard = () => {
  useTokenAutoVerifier();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [mapCategorias, setMapCategorias] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedDocument, setSelectedDocument] = useState(null);

  const documentsPerPage = 15;

  const fetchDocuments = async (categoryId = null) => {
    setLoading(true);
    try {
      const data = await documentService.getAllDocuments();
      if (categoryId) {
        setDocuments(data.filter((doc) => doc.rubro === categoryId));
      } else {
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const categorias = await categoryService.getCategories();
      const map = {};
      categorias.forEach((cat) => {
        map[cat._id] = cat.nombre;
      });
      setMapCategorias(map);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchCategorias();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction =
        prev.key === key && prev.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
    setCurrentPage(1);
  };

  const getSortedDocuments = () => {
    if (!sortConfig.key) return [...documents].reverse();

    return [...documents].sort((a, b) => {
      const idxNombreA = a.propiedadesnombre?.indexOf("nombre");
      const idxNombreB = b.propiedadesnombre?.indexOf("nombre");
      const nombreA = idxNombreA !== -1 ? a.propiedades?.[idxNombreA] : "";
      const nombreB = idxNombreB !== -1 ? b.propiedades?.[idxNombreB] : "";

      const idxFechaA = a.propiedadesnombre?.indexOf("fecha");
      const idxFechaB = b.propiedadesnombre?.indexOf("fecha");
      const fechaA = idxFechaA !== -1 ? a.propiedades?.[idxFechaA] : "";
      const fechaB = idxFechaB !== -1 ? b.propiedades?.[idxFechaB] : "";

      const rubroA = mapCategorias[a.rubro] || "Desconocido";
      const rubroB = mapCategorias[b.rubro] || "Desconocido";

      let valA, valB;

      switch (sortConfig.key) {
        case "nombre":
          valA = nombreA.toLowerCase();
          valB = nombreB.toLowerCase();
          break;
        case "fecha":
          valA = fechaA;
          valB = fechaB;
          break;
        case "rubro":
          valA = rubroA.toLowerCase();
          valB = rubroB.toLowerCase();
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedDocuments = getSortedDocuments();
  const totalPages = Math.ceil(sortedDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const endIndex = startIndex + documentsPerPage;
  const currentDocs = sortedDocuments.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const getArrow = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const clearSelectedDocuments = () => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => ({ ...doc, selected: false }))
    );
  };

  const handleCategoriaSeleccionada = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    fetchDocuments(categoriaId);
  };

  const refreshDocuments = async () => {
    await fetchDocuments(categoriaSeleccionada);
  };

  const handleRowClick = (doc, event) => {
    const ignoredTags = ["INPUT", "BUTTON", "SVG", "path"];
    if (
      ignoredTags.includes(event.target.tagName) ||
      event.target.closest(".boton-descargar")
    )
      return;
    setSelectedDocument(doc);
  };

  return (
    <div className="dashboard">
      <header>
        <Top isConfigOpen={isConfigOpen} setIsConfigOpen={setIsConfigOpen} />
      </header>

      <aside>
        <Sidebar
          setCategoriaSeleccionada={handleCategoriaSeleccionada}
          setDocuments={setDocuments}
          selectedDocs={documents.filter((d) => d.selected)}
          clearSelectedDocuments={clearSelectedDocuments}
        />
      </aside>

      <div className="dashboard-main">
        <table>
          <thead>
            <tr>
              <th></th>
              <th onClick={() => handleSort("nombre")}>
                Nombre {getArrow("nombre")}
              </th>
              <th onClick={() => handleSort("rubro")}>
                Rubro {getArrow("rubro")}
              </th>
              <th onClick={() => handleSort("fecha")}>
                Fecha {getArrow("fecha")}
              </th>
              <th>
                <button
                  onClick={refreshDocuments}
                  title="Refrescar documentos"
                  className="boton-refrescar"
                >
                  <FontAwesomeIcon
                    icon={faSyncAlt}
                    className="icono-refrescar"
                  />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <Loader />
                </td>
              </tr>
            ) : currentDocs.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  No hay documentos disponibles para esta categoría.
                </td>
              </tr>
            ) : (
              currentDocs.map((doc) => {
                const idxNombre = doc.propiedadesnombre?.indexOf("nombre");
                const idxFecha = doc.propiedadesnombre?.indexOf("fecha");
                const nombre =
                  idxNombre !== -1 ? doc.propiedades?.[idxNombre] : "";
                const fecha =
                  idxFecha !== -1 ? doc.propiedades?.[idxFecha] : "";
                const rubroNombre = mapCategorias[doc.rubro] || "Desconocido";
                const hasUrlDocumento = doc.hasOwnProperty("urldocumento");

                return (
                  <tr
                    key={doc._id}
                    onClick={(e) => handleRowClick(doc, e)}
                    style={{ cursor: "pointer" }}
                  >
                    <td
                      className="checkbox-cell"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={doc.selected || false}
                        onChange={() =>
                          setDocuments((prevDocs) =>
                            prevDocs.map((d) =>
                              d._id === doc._id
                                ? { ...d, selected: !d.selected }
                                : d
                            )
                          )
                        }
                        className="custom-checkbox"
                      />
                    </td>
                    <td>{nombre}</td>
                    <td>{rubroNombre}</td>
                    <td>{fecha}</td>
                    <td
                      className="acciones"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {hasUrlDocumento ? (
                        <button
                          onClick={() =>
                            documentService.downloadDocument(doc._id)
                          }
                          className="boton-descargar"
                          title="Descargar"
                        >
                          <FontAwesomeIcon
                            icon={faDownload}
                            className="icono-descargar"
                          />
                        </button>
                      ) : (
                        <button
                          className="boton-descargar"
                          disabled
                          title="No disponible"
                        >
                          <FontAwesomeIcon
                            icon={faDownload}
                            className="icono-descargar"
                          />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {documents.length > documentsPerPage && currentDocs.length > 0 && (
          <div className="pagination">
            <span>
              {startIndex + 1}–{Math.min(endIndex, documents.length)} de{" "}
              {documents.length}
            </span>
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ◀
            </button>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              ▶
            </button>
          </div>
        )}
      </div>

      {selectedDocument && (
        <UpdateDocument
          documento={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDocumentUploaded={refreshDocuments}
        />
      )}
    </div>
  );
};

export default Dashboard;
