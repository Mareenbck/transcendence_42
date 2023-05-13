import React, { useContext, useState, useEffect } from "react";
import '../../style/UserChart.css'
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../store/AuthContext";


const UserChart= (props: any) => {

    return (
        <div className="combPos">
             <div className="cadre" >
                <p>{props.userName} </p>
                <p>{props.h} pts</p>
            </div>

        </div> 
    )

}
export default UserChart;