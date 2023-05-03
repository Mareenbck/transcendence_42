import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material" ;
import { TextField} from "@mui/material";
import { Button} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from '@mui/icons-material/AddBox';


export default function JoinProtectedChannel(props: any) {
    const [icon, setIcon] = useState<any>();

    useEffect(() => {
      setIcon(<AddBoxIcon />);
      }, []);

    const handleOpenJoinModal = () => {
        props.onOpenJoinModal();
    };

    return (
      <>
        <IconButton onClick={handleOpenJoinModal}>
            {icon}
        </IconButton>
      </> 
    );
}