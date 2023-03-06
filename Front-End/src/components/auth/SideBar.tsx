import React, { FormEvent, useContext, useRef, useState } from "react";
import style from '../../style/SideBar.module.css'
import { Link } from "react-router-dom";
import AuthContext from "../../store/AuthContext";


function SideBar(props: any)
{
    const authCtx = useContext(AuthContext);
	  const id = authCtx.userId;

    return (
            <div className={style.position}>
                   <p className={style.tit}>{props.title}, {/*props.username*/} {authCtx.username}!</p>
                   {props.isLoggedIn  && <Link to="/auth/signin" className={style.lgu} /*onClick={props.logout}*/
                                  onClick={() => localStorage.removeItem(authCtx.token)}>
                          LogOut<span> </span></Link>}
                   <br/>
            <Link to="/game/play" className={style.btn}>Play Game </Link>
				    <Link to="/chat/message" className={style.btn}>Chat</Link>
				    
            <Link to={`/users/profile/${authCtx.userId}`} className={style.btn}>Profile page</Link>
				    <Link to="../../pages/setting" className={style.btn}>setting</Link>
				    <Link to="/auth/signin" className={style.btn}>Score</Link>    				
			</div>
    )

}

export default SideBar;
