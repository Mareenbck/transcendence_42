import React from "react";
import '../../style/UserChart.css'

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
