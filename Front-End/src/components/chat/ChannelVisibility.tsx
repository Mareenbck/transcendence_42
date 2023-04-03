import React, { useState, useEffect } from "react";

interface Conversation {
  id: number;
  name: string;
  visibility: string;
  isPrivate: boolean;
  isProtected: boolean;
  isPublic: boolean;
}

interface Props {
    conversation: Conversation;
  }
  
  const ChannelVisibility = ({ conversation}: Props) => {
    const [visibility, setVisibility] = useState("");
  
  
    function getIconByChannelType() {
      let icon;
  
      if (conversation.visibility === "PRIVATE") {
        icon = (
          <i
            className="fas fa-lock icon-private"
            title="Private conversations"
          ></i>
        );
      } else if (conversation.visibility === "PWD_PROTECTED") {
        icon = (
          <i
            className="fas fa-key icon-protected"
            title="Protected conversations"
          ></i>
        );
      } else {
        icon = (
          <i className="fas fa-globe icon-public" title="Public Channel"></i>
        );
      }
  
      return icon;
    }
  
    return getIconByChannelType();
  };
  

export default ChannelVisibility;
