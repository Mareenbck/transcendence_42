import './Enter.css'
import '../../../App.tsx'
import React, { useState } from 'react'

/**function Enter(propes) { */
const Enter = ({titel}) =>  {  
    titel: String;
    /**const [showEvents, setShowEvents] = useState(true)*/

    /**const handelClick = () => {
        console.log(titel)
        setShowEvents(false)
    }*/

    return(
        <div className="enter">
        <div> 
            <button className = 'btn'>{titel}</button>
        </div>    
        </div>
    )
}

export default Enter