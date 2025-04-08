import Form from '../../components/form/Form'

{/*Creado para invocar la página principal, si es que las credenciales esten bien, excepto que pida ir a registrase*/}
const Login = () => { 
    return ( 

        <div>
            <Form isLogin={true} route1={'/dashboard'} route2={'/register'}></Form>
        </div>

    ); 

    }

export default Login;