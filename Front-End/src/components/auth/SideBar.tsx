import React from 'react';
import style from '../../style/SideBar.module.css'
import { Link } from "react-router-dom";

function SideBar(props: any)
{
    return (
        <div> 
            <div className={style.position}>
                   <p className={style.tit}>{props.title}, {props.username}!</p>
                   {props.isLoggedIn && <Link to="/auth/signin" className={style.lgu} onClick={props.logout}
                                  /*onClick={() => localStorage.removeItem('token')}*/>
                          LogOut<span> </span></Link>}
                   <br/>
                    <Link to="/auth/signup" className={style.btn}>Play Game </Link>
				    <Link to="/chat/message" className={style.btn}>Chat</Link>
				    
                    <Link to={`/users/profile/${props.id}`} className={style.btn}>Profile page</Link>
				    <Link to="../../pages/setting" className={style.btn}>setting</Link>
				    <Link to="/auth/signin" className={style.btn}>Score</Link>    				
			</div>
		</div>
    )

}

export default SideBar;
