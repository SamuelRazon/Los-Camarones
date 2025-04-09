import './container.css';
{/*Usado un componente para la estructura básica que tendra las propiedades */}
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