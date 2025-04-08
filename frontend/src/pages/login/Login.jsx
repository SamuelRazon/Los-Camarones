import Form from '../../components/form/Form'

{/*Creado para invocar la página principal, si es que las credenciales esten bien, excepto que pida ir a registrase*/}
const Login = () => { 
    return ( 

        <div>
            <Form isLogin={true} route1={'/Dashboard'} route2={'/Register'}></Form>
        </div>

    ); 

    }

export default Login;