import './Enter.css'
import '../App.tsx'
import React, { useState, useEffect } from 'react';


/**function Enter(propes) { */
const Enter = ({titel}) =>  {
    titel: String;
    /**const [showEvents, setShowEvents] = useState(true)*/

    /**const handelClick = () => {
        console.log(titel)
        setShowEvents(false)
    }*/
	const [username, setUsername] = useState('');

	useEffect(() => {
		const cookies = document.cookie.split(';');
		console.log(cookies);
		const cookie = cookies.find(c => c.trim().startsWith('username='));
		if (cookie) {
			setUsername(cookie.split('=')[1]);
		}
	}, []);
    console.log(username);

    return(
        <div className="enter">
        <div>
            <h1>Hello {username}</h1>
            <button className = 'btn'>{titel}</button>
        </div>
        </div>
    )
}

export default Enter
