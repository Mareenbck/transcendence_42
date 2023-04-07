import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Settings from '@mui/icons-material/Settings';


export default function ChannelsSettings(props: any) {

    const [openModal, setOpenModal] = useState(false);

    function showSettingsForUsers() {
        if (props.role == "ADMIN") {
            <IconButton onClick={() => props.setOpenModal(true)}>                
                <Settings fontSize="small" />
            </IconButton>
        } else {
            return null;
        }
    }

    return (
        <div>
            {showSettingsForUsers()}
        </div>
    );
}