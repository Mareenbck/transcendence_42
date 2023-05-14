import React, { useEffect, useState } from "react";
import Settings from '@mui/icons-material/Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';

export default function ChannelsSettings(props: any) {
    const [icon, setIcon] = useState<any>();

    useEffect(() => {
      if (props.role === "ADMIN" || props.role === "OWNER") {
        setIcon(<Settings />);
      } else {
        setIcon(<Settings style={{ opacity: 0 }} />);
      }
    }, [props.role]);

    const handleOpenModal = () => {
        if (props.role === "ADMIN" || props.role === "OWNER") {
          props.onOpenModal();
        }
      };


    return (
      <>
        {props.role && (
          <Tooltip title="Change Password">
            <FontAwesomeIcon icon={faGear}  onClick={handleOpenModal} className="btn-dialog-navbar"/>
          </Tooltip>
        )}
      </>
    );
  }
