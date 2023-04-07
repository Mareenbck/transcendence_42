import React, { FormEvent, useEffect, useState } from "react";
import Conversation from "./Conversation";
import PopUp from "./PopUpChannel";
import ChannelVisibility from "./ChannelVisibility";
import { socket } from "../../../service/socket";
import CreateChannelButton from "./CreateChannelBtn";
import UpdateChannelsInList from "./UpdateChannelsInList";



export default function Channels(props: any) {

    return (
        <div className="chatMenuW">
        <CreateChannelButton/>
        <UpdateChannelsInList/>
      </div>
    );
}