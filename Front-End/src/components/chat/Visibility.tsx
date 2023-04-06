import React, { FormEvent, useContext, useState } from "react";
import "../../style/ChannelVisibility.css"
import Settings from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from "@mui/material/IconButton";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ConversationReq from "./conversation/ConversationRequest";
import AuthContext from "../../store/AuthContext";

export default function Visibility(props: any) {


    return (
        <div>{visibility}</div>
    );
}
