import React, { useContext, useState, useEffect } from "react";
import '../../style/UserChart.css'
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../store/AuthContext";


const UserChart= (props: any) => {
    let h = props.h

    h = (props.h) * (100) / 20

    // if(h <= 50)
    //     h = (props.h) * (100) / 10
    // else if (50 < h  && h<=100)
    //     h = (props.h) * (100) / 25
    // else if (100 < h  && h<=210)
    //     h = (props.h) * (100) / 50
    // else if (210 < h  && h<=310)
    //     h = (props.h) * (100) / 100
    // else if (310 < h  && h<=410)
    //     h = (props.h) * (100) / 150
    // else
    //     h = (props.h) * (100) / 200


    return (
        <div className="combPos">
            <div className="cadre" style={{height: h}}>
               
                <p>{props.userName} </p>
                <p>{props.h}</p>
            </div>

        </div> 
    )

}
export default UserChart;