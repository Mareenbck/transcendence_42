import React, { useContext, useState, useEffect } from "react";
import '../../style/UserChart.css'
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../store/AuthContext";


const UserChart= (props: any) => {

    return (
        <div className="cadre">
            <p>{props.userName}</p>
            <p>add frind</p>
        </div>  
    )

}
export default UserChart;