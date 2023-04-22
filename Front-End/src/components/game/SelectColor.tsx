import React , { useEffect, useState, useContext, useRef }  from "react";

import '../../style/SelectColor';
import Card from "../../components/utils/Card";


const SelectColor = (props: any) => {
    // Pour partis de Modal select Color,
    
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
            {/*<div className="card-menu">
					<Card color='blue' title="Select your favorite color for.."  type="menu" width="100%"></Card>
					
    </div>
                <div className='card-wrapper'>
						<Card color='yellow' title="List of online Games" type="match" width="100%"></Card>
				</div>*/}



            <div className="card-option">
                        <div className="poslogo">
                            <a herf="#">
                                Logo
                            </a>
                            <h2 >Select your favorite color for...</h2>
                         </div>
                         <div className="posColor">
                            <button  className = "posColor__circlebtn" /*onClick={props.changColorToRed} */  style={{backgroundColor: "red"}} ></button>
                            <button  className = "posColor__circlebtn" /*onClick={props.changColorToBlue}*/ style={{backgroundColor: "blue"}}></button>
                            <button  className = "posColor__circlebtn" /*onClick={props.changColorToGreen}*/ style={{backgroundColor: "green"}}></button>
                            <button  className = "posColor__circlebtn "/*onClick={props.changColorToBlack}*/ style={{backgroundColor: "black"}}></button>
                         </div>
                         {/*<button onClick={handleColorModal}>Change Color</button>*/}
                    </div>

                    
			</div>
		</>
	)
}
export default SelectColor;