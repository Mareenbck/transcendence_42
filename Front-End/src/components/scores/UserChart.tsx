import React, { useContext, useState, useEffect } from "react";
import '../../style/UserChart.css'
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../store/AuthContext";


const UserChart= (props: any) => {

    const h = (props.h) * (100) / 10

    return (
        <div className="combPos">
            <div className="cadre" style={{height: h}}>
               
                <p>{props.userName}</p>
                <p>{props.h}</p>
            </div>

        </div> 
    )

}
export default UserChart;