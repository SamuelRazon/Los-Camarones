import Form from '../../components/form/Form'

{/*Creado para invocar  ir al registro*/}
const Register = () => { 
    return ( 

        <div>
            <Form isLogin={false}  route2={'/login'}></Form>
        </div>

    ); 

    }

    export default Register;
