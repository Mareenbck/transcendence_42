import React, { FormEvent, useRef } from "react";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { isAnyArrayBuffer } from "util/types";
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from "@mui/material";
import { faCrown, faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { channel } from "diagnostics_channel";


export default function DeleteChannel(props:any) {

    const [button, setButton] = React.useState<any>()
    
    const handleDeleteChannel = (e:  React.SyntheticEvent<unknown>) => {
        deleteChannel(props.channelId)
    }


    React.useEffect (() => {
		// console.log("props.type--->")
		// console.log(props.type)
			setButton(<Tooltip title="Delete Channel">
				<FontAwesomeIcon icon={faTrash} onClick={handleDeleteChannel} className="btn-dialog-navbar"/></Tooltip>)
	}, [props.type])

    const deleteChannel = async (channelId: string) => {
        try { 
            const response = await fetch(`http://localhost:3000/chatroom2/${channelId}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({channelId: props.channelId}),
            });
            console.log("response in fetch", response)
            const text = await response.text();
            let data;
            if(text) {
                try {
                    data = JSON.parse(text);
                } catch (error) {
                    console.error(error);
                    return;
                }
            }
            console.log("data in fetch", data)
            if (!response.ok) {
                console.log("can't remove the channel")
                return "error"
            }
        }catch(error) {
            console.log("error", error)
        }
    }



    return (
        <>
            {button}    
        </>
    );
}