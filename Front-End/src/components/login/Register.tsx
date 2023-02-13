import { useState } from 'react'

const Register = (props) => {
    const [email, setEmail] = useState(true);
    const [pass, setPass] = useState(true);
    const [name, setName] = useState(true)

    const handelSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    const nFormSwitch = (login) =>{

    }

    return(
        <div>
            <form onSubmit={handelSubmit}>
                <label>
                    <span>Full Name</span>
                    <input type="text"></input>
                </label>

                <label>
                    <span>Email</span>
                    <input type='email'></input>
                </label>

                <label>
                    <span>Password</span>
                    <input type='password'></input>
                </label>

                <label>
                    <span>Avatar</span>
                    <input type='image'></input>
                </label>

                <button type="submit">Log In</button>
            </form>

            <button onClick={props.nFormSwitch('login')}>Already have an account? Login here</button>

        </div>
    )
}

export  default Register