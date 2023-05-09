import React , { useEffect, useState, useContext, useRef }  from "react";

import '../../style/SelectColor.css';
import Card from "../../components/utils/Card";


type props = {
	changcolor : any;
	handelclose: any;
}

const SelectColor = (props: any) => {

    const [ShowColorModal, setShowColorModal] = useState(false); 
    const handleColorModal = () => {
        setShowColorModal(true)
    }

	const formattedDate = (dateString :string) => {
		
		return ;
	};

	return (
		<>
			<div className="">

            <div className="card-option">
                        <div className="poslogo">
                           
                            <h2 >Changing Color</h2>
                         </div>
                         <div className="posColor" style={{"cursor": "prompt"}}>
                            <button  className = "posColor__circlebtn" onClick={props.changColorToRed}   style={{backgroundColor: "rgb(158, 28, 28)"}} ></button>
                            <button  className = "posColor__circlebtn" onClick={props.changColorToBlue} style={{backgroundColor: "rgb(37, 37, 167)"}}></button>
                            <button  className = "posColor__circlebtn" onClick={props.changColorToGreen} style={{backgroundColor: "rgb(40, 128, 40)"}}></button>
                            <button  className = "posColor__circlebtn " onClick={props.changColorToBlack} style={{backgroundColor: "black"}}></button>
                         </div>
                         
                    </div>

                    
			</div>
		</>
	)
}
export default SelectColor;