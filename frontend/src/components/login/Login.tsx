import Enter from './enter/Enter'
import { useState } from 'react'
import '../../App'

/**function Log() {**/
const Log = () => {
      
    return(
        <div>
            <Enter titel = "Signup"/>
            <Enter titel = "Signin"/>
            <Enter titel = "Log 42"/>

        </div>
    )
}

export default Log