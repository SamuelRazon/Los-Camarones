import Form from '../../components/form/Form'

const Login = () => { 
    return ( 

        <div>
            <Form isLogin={true} route1={'/Dashboard'} route2={'/Register'}></Form>
        </div>

    ); 

    }

export default Login;