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
    visu: { id: number; visibility: string }[];
  }
  
  const ChannelVisibility = ({ conversation, visu }: Props) => {
    const [visibility, setVisibility] = useState("");
  

    
    useEffect(() => {
      console.log("VISIBILIITY")
      console.log(conversation.visibility)
      const currentVisu = visu.find(v => v.id === conversation.id);
      if (currentVisu) {
        setVisibility(currentVisu.visibility);
      }
    }, [conversation.id, visu]);
  
    function getIconByChannelType() {
      let icon;
  
      if (conversation.visibility === "PRIVATE") {
        icon = (
          <i
            className="fas fa-lock icon-private"
            title="Private conversations"
          ></i>
        );
      } else if (conversation.visibility === "PROTECTED") {
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
