import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';

// import 'Friend.css'

const Friends = () => {

	const [friends, setFriends] = useState([])
	const authCtx = useContext(AuthContext);
	const friendsList = localStorage.getItem('userlist')


	
	const isLoggedIn = authCtx.isLoggedIn;

	//recuperation de la liste de users
	useEffect(() => {
	}
	)
	return (
		<div className="User"> 
			User list : 
			<table>
				<td>Here are all users of the db  </td>

				{isLoggedIn && <p>  Votre username : {friendsList} </p>}
				<tbody>
					{
						// username.map()
					}
				</tbody>

			</table>	
		</div>
	)
}

export default Friends
