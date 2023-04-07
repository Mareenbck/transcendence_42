import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Settings from '@mui/icons-material/Settings';
import ChannelVisibility from "./ChannelVisibility";


export default function ChannelsSettings(props: any) {

    const [openModal, setOpenModal] = useState(false);
	const [icon, setIcon] = useState<any>();

    // const style = {
    //     opacity: props.role ? 1 : 0,
    //   };
    useEffect(() => {
		if (props.role === "ADMIN") {
			setIcon(<Settings />);
		} else {
			setIcon(<Settings style={{ opacity: 0 }} />);
		}
		}, [props.role]);

//console log le props.role
    return (
        <>
            <IconButton onClick={() => setOpenModal(true)}>       
            {icon}         
            </IconButton>        
        </>
        // <div style={style}>
        // </div>
    );
}