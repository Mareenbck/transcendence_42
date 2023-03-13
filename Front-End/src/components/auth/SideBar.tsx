import React, { FormEvent, useContext, useRef, useState, useEffect } from "react";
import style from '../../style/SideBar.module.css'
import { Link, useParams, NavLink } from "react-router-dom";
import AuthContext from "../../store/AuthContext";
import Menu from "../../pages/Menu";




function SideBar(props: any)
{
    const authCtx = useContext(AuthContext);
	  const id = authCtx.userId;
    // const { id } = useParams();
    
   const [isActive, setIsActive]= useState(true);

/*
    const Click = () =>{
      
    };*/

    

    return (
            <div className={style.sideBar}>
                   <div className={style.top}>
                        <div className={style.logo}>
                            <i className="bx bx-menu"></i>
                            <span> {props.title},{authCtx.username}!</span>

                        </div>

                   </div>
                   <div>
                        <Link to="/auth/signin" className={style.lgu} 
                                                onClick={authCtx.logout}>LogOut</Link>
                        <br/>
                        <div className={style.links}>                           
                            
                            <NavLink 
                                style={({isActive}) => {
                                    return{
                                        color : isActive ? "grey" : "black"
                                    };
                                }
                                }
                            to="/game/play" 
                            className= {style.btn}
                            >Play Games
                            </NavLink>
                            <NavLink 
                                style={({isActive}) => {
                                    return{
                                        color : isActive ? "grey" : "black"
                                    };
                                }
                                }
                            to="/chat/message" 
                            className= {style.btn}
                            >Chat
                            </NavLink>
                            <NavLink 
                                style={({isActive}) => {
                                    return{
                                        color : isActive ? "grey" : "black"
                                    };
                                }
                                }
                            to={`/users/profile/${authCtx.userId}`} 
                            className= {style.btn}
                            >Profile page
                            </NavLink>
                            <NavLink 
                                style={({isActive}) => {
                                    return{
                                        color : isActive ? "grey" : "black"
                                    };
                                }
                                }
                            to="/settings" 
                            className= {style.btn}
                            >Setting
                            </NavLink>
                            
                            <NavLink 
                                style={({isActive}) => {
                                    return{
                                        color : isActive ? "grey" : "black"
                                    };
                                }
                                }
                            to="/scores" 
                            className= {style.btn}
                            >Scores</NavLink>
                              
                            
                            
                        </div>    
                    </div>
		    </div>
    
    )
}

export default SideBar;