import Form from '../../components/form/Form'

{/*Creado para invocar  ir al registro*/}
const Register = () => { 
    return ( 

        <div>
            <Form isLogin={false} route1={'#'} route2={'/Login'}></Form>
        </div>

    ); 

    }

    export default Register;
