import React, { FormEvent, useState } from "react";
import PopUp from "./PopUpChannel";
import ChannelsSettings from "./ChannelsSettings";

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
            <button className='create-channel-button' onClick={handleCreateChannel}>Create new channel</button>
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