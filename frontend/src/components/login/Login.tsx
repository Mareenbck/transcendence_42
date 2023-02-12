import Enter from './enter/Enter'
import { useState } from 'react'
import '../../App'
import './Register'
import Register from './Register'

/**function Log() {**/
const Log = (props) => {
    const [email, setEmail] = useState(true);
    const [pass, setPass] = useState(true);

    const handelSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    const nFormSwitch = (register) =>{

    }

    return(
        <div>
            <form onSubmit={handelSubmit}>
                <label>
                    <span>Email</span>
                    <input type= 'email'></input>
                </label>
                <br /> <br />   
                <label>
                    <span>Password</span>
                    <input type= 'password'></input>
                </label>
                <br /> <br />
                <button type="submit">Log In</button>
            </form>
            <br /> 
            <button onClick={props.nFormSwit}>Don't have an account? Register here</button>
        </div>
    )
}

export default Log