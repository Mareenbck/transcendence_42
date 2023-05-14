import React from "react";
import '../../style/SelectColor.css';

type props = {
	changcolor : any;
	handelclose: any;
}

const SelectColor = (props: any) => {

	return (
		<>
		<div className="">
			<div className="card-option">
				<div className="poslogo">
					<h2 >Change Color</h2>
				</div>
				<div className="posColor" style={{"cursor": "prompt"}}>
					<button  className = "posColor__circlebtn" onClick={props.changColorToRed}   style={{backgroundColor: "#699BF7"}} ></button>
					<button  className = "posColor__circlebtn" onClick={props.changColorToBlue} style={{backgroundColor: "#C7B9FF"}}></button>
					<button  className = "posColor__circlebtn" onClick={props.changColorToGreen} style={{backgroundColor: "#FF5166"}}></button>
					<button  className = "posColor__circlebtn " onClick={props.changColorToBlack} style={{backgroundColor: "black"}}></button>
				</div>
			</div>
		</div>
		</>
	)
}
export default SelectColor;
