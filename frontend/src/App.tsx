import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Login from './components/login/Login'
import Register from './components/login/Register'
import Model from './components/model/Model'
import Enter from './components/login/enter/Enter'

function App() {
  const [count, setCount] = useState(0)
/*
{!showEvents && showEvents2 && <p>SigupPage</p>}
        currentForm === 'login' ?  <Login  onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm} />
*/
  
  const [showSignIn, setShowSigIn] = useState(true);
  const [showSignUp, setShowSigUp] = useState(true);
  const [showUser42, setShowUser42] = useState(true);
  const [showLogin, setLogin] = useState(false);

  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (FormName) =>{
    setCurrentForm(FormName);

  }

  const handelClickSignIn = evet =>{
    setShowSigIn(current => !current)
    setLogin(true)
    
  };

  const handelClickSignUp = evet =>{
    setShowSigUp(current => !current)
  };

  const handelClickUser42 = evet =>{
    setShowUser42(current => !current)
  };

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
        {showSignIn && showSignUp && showUser42 &&<img src="/vite.svg" className="logo" alt="Vite logo" />}
        </a>
        <a href="https://reactjs.org" target="_blank">
        {showSignIn && showSignUp && showUser42 &&<img src={reactLogo} className="logo react" alt="React logo" />}
        </a>
        {showSignIn && showSignUp && showUser42 && <h1>Transcendence</h1>}
        {showSignIn && showSignUp && showUser42 && <button className = 'btn' onClick={handelClickSignIn}>Signin</button>}
        {showSignIn && showSignUp && showUser42 && <button className = 'btn' onClick={handelClickSignUp}>Signup</button>}
        {showSignIn && showSignUp && showUser42 && <button className = 'btn' onClick={handelClickUser42}>User42</button>}
        {showLogin && <Login />}          
     </div>
 

    </div>
      )
}

export default App
