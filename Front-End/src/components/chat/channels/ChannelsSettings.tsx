import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Settings from '@mui/icons-material/Settings';
import ChannelVisibility from "./ChannelVisibility";


export default function ChannelsSettings(props: any) {
    const [openModal, setOpenModal] = useState(false);
    const [icon, setIcon] = useState<any>();
  
    useEffect(() => {
      if (props.role === "ADMIN") {
        setIcon(<Settings />);
      } else {
        setIcon(<Settings style={{ opacity: 0 }} />);
      }
    }, [props.role]);

    const handleOpenModal = () => {
        if (props.role === "ADMIN") {
          props.onOpenModal();
        }
      };
      
  
    return (
      <>
        {props.role && (
          <IconButton onClick={handleOpenModal}>
            {icon}         
          </IconButton>        
        )}
      </>
    );
  }
  