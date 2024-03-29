import { useEffect, useState } from "react";
import "./../../../style/Conversation.css"
import React from "react";
import '../../../style/UsersOnChannel.css'
import Avatar from '@mui/material/Avatar';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import PasswordIcon from '@mui/icons-material/Password';

export default function Conversation(props: any) {
  const [showParticipants, setShowParticipants] = useState(false);
	const [icon, setIcon] = useState<any>();
	const [color, setColor] = useState<string>("");

	useEffect(() => {
		if (props.visibility === 'PUBLIC') {
			setIcon(<PublicIcon />);
			setColor("channel-public");
		} else if (props.visibility === 'PWD_PROTECTED') {
			setIcon(<PasswordIcon />);
			setColor("channel-protected");
		} else {
			setIcon(<LockIcon />);
			setColor("channel-private");
		}
	}, [props.visibility])

  const handleOpen = () => {
    setShowParticipants(true);
  };

  const handleClose = () => {
    setShowParticipants(false);
  };

  return (
    <>
      <div className="conversation">
		<Avatar variant="rounded" className={color} >
			{icon}
		</Avatar>
        <div className="conversationName" onClick={handleOpen}>{props.name}</div>
      </div>

    </>
  );
}

