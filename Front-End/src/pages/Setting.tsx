import React from 'react';
import '../style/Home.css'
import { Link } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import { useContext } from "react";
import SideBar from '../components/auth/SideBar'

const Setting = () => {
    const authCtx = useContext(AuthContext);
    const id = authCtx.userId;
    

    return(
        <>
        <h2>setting page</h2>
        <SideBar title= "Setting Page" id={id} />}
        </>
    )

}
export default Setting;