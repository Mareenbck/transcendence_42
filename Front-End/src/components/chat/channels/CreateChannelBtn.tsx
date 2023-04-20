import React, { FormEvent, useState } from "react";
import PopUp from "./PopUpChannel";
import ChannelsSettings from "./ChannelsSettings";
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

export default function CreateChannelButton(props: any) {
    const [showPopUp, setShowPopUp] = useState(false);


    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        setShowPopUp(true);
      };

      const handleCreateChannel = () => {
        setShowPopUp(true);
      };
    return (
		<form onSubmit={handleFormSubmit}>
		<Tooltip title="Create Channel" placement="left">
			<Fab color="secondary" aria-label="add">
				<AddIcon onClick={handleCreateChannel}/>
			</Fab>
		</Tooltip>
            {/* <button className='create-channel-button' onClick={handleCreateChannel}>Create new channel</button> */}
            {showPopUp && (
                <PopUp
                title="Création d'un nouveau channel"
                message="Choisissez les options de votre channel"
                onCancel={() => setShowPopUp(false)}
                onClick={() => setShowPopUp(false)}
                onSubmit={{handleFormSubmit}}
                >
                </PopUp>

            )}

      </form>
    );
}
