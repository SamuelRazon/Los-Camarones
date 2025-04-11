import './container.css';
/*Usa un componente para la estructura básica que tendra las propiedades, sobre 
* los elementos de los documentos que seran presentados en el div de clase main-container 
*/
const Container = ({ nombre, categoria, fecha }) => {
    return (
      <div className="document">
        <tt>{nombre}</tt>
        <p>{categoria}</p>
        <a>{fecha}</a>
      </div>
    );
  };
  
export default Container;