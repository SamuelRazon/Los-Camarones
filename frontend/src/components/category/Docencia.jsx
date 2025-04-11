// Componente para Docencia (Docencia.jsx)
import Container from './container';

/**Solo es un ejemplo, no se si es funcional a la largo del proyecto */
const Docencia = () => {
  return (
    <div>
      <Container
        nombre="Documento de Docencia 1" 
        categoria="Docencia" 
        fecha="08/04/2025" 
      />
      <Container
        nombre="Documento de Docencia 2" 
        categoria="Docencia" 
        fecha="08/04/2025" 
      />
    </div>
  );
};

export default Docencia;
