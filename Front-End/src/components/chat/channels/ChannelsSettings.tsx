import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Settings from '@mui/icons-material/Settings';
import { Modal } from "@mui/material";


export default function ChannelsSettings(props: any) {

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
        <IconButton onClick={() => props.setOpenModal(true)}>                
            <Settings fontSize="small" />
        </IconButton>
        </>
    );
}