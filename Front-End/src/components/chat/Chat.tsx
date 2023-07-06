import { useEffect, useContext, useState, } from 'react'
import AuthContext from '../../store/AuthContext';
import useSocket from '../../service/socket';
import Fetch from "../../interfaces/Fetch"
import '../../style/Chat.css'
import '../../style/Friends.css';
import React from 'react';
import { UserChat, OnlineU} from "../../interfaces/iChat";
import UpdateChannelsInList from './channels/UpdateChannelsInList';
import { Tab } from '@mui/material';
import { Tabs } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MailIcon from '@mui/icons-material/Mail';
import CurrentChannel from './channels/CurrentChannel';
import UsersOnChannel from './channels/UsersOnChannel';
import UsersWithDirectMessage from './message/usersWithMessages';
import CurrentDirectMessages from './message/CurrentDirectMessages';
import UsersChat from './message/UsersChat';
import { FriendContext } from '../../store/FriendshipContext';

function Chat(props: any) {
  const user = useContext(AuthContext);
  const friendCtx = useContext(FriendContext);
  const id = user.userId;
  const [onlineUsers, setOnlineUsers] = useState<OnlineU[]> ([]);
  const [currentChat, setCurrentChat] = useState<any | null>(null);
  const [currentDirect, setCurrentDirect] = useState<UserChat | null> (null);
  const [otherUsers, setOtherUsers] = useState <UserChat[]> ([]);
  const [allUsers, setAllUsers] = useState <UserChat[]> ([]);
  const [toBlock, setToBlock] = useState<UserChat | null>(null);
  const [toUnblock, setToUnblock] = useState<UserChat | null>(null);
  const [fromBlock, setFromBlock] = useState<number | null>(null);
  const [unfromBlock, setUnfromBlock] = useState<number | null>();
  const [invited, setInvited] = useState<UserChat | null> (null);
  const [sendMessage, addListener] = useSocket()
  const [blockForMe, setBlockForMe] = useState<number | null>();
  const [unblockForMe, setUnblockForMe] = useState<number | null>();

  useEffect(() => {
    sendMessage("addUserChat", user as any);
    return () => {
      sendMessage("removeUserChat", user as any);
    }
  },[user])

  useEffect(() => {
    addListener("getUsersChat", users => {
      setOnlineUsers(users);
    });
  });

  useEffect(() => {
    addListener("wasInvited", data => {
      setInvited(data);
    });
  });

  useEffect(() => {
    addListener("wasBlocked", data => {
      if (+data.id !== +id)
      { setFromBlock(+data.id);}
    });
  },);

  useEffect(() => {
    addListener("wasUnblocked", data => {
      if (+data.id !== +id)
      { setUnfromBlock(+data.id);}
    });
  },);

  useEffect(() => {
    addListener("blockForMe", data => {
      if (+data.id !== +user.userId)
        { setBlockForMe(+data.id);}
    });
  });

  useEffect(() => {
    addListener("unblockForMe", data => {
      if (+data.id !== +user.userId)
        { setUnblockForMe(+data.id);}
    });
  });

  async function getAllUsersWithBlocked(token: string) {
    const response = await Fetch.fetch(token, "GET", `users\/block\/users`);
	  const updatedFriends = await Promise.all(response.map(async (friend: UserChat) => {
		const avatar = await friendCtx.fetchAvatar(friend.id);
		return { ...friend, avatar };
	}));
	setAllUsers(updatedFriends);
    setOtherUsers(response.filter((u: {id: string;})  => !(onlineUsers.some(e => +e.userId.userId === +u.id))));
  };

  useEffect(() => {
    getAllUsersWithBlocked(user.token);
  }, []);

  useEffect(() => {
    if (allUsers !== undefined && user.userId && fromBlock && fromBlock !== +user.userId) {
      const i = allUsers.findIndex(userX => +userX.id === +id);
      const j = allUsers.find(userX => +userX.id === +id);
      const k = allUsers.find(userX => +userX.id === +fromBlock);
      k ? j?.blockedFrom.push(k) : "";
      const NewAll = allUsers;
      j ? NewAll.splice(i, 1, j) : "";
      setAllUsers([...NewAll]);
      if (currentDirect && +currentDirect.id === fromBlock)
        {setCurrentDirect(null);}
      setFromBlock(null);
    };
  }, [fromBlock]);

  useEffect(() => {
    if (allUsers !== undefined && user.userId && unfromBlock && unfromBlock !== +user.userId) {
      const i = allUsers.findIndex(userX => +userX.id === +id);
      const j = allUsers.find(userX => +userX.id === +id);
      j ? j.blockedFrom = j.blockedFrom.filter((u: UserChat) => +u.id !== unfromBlock) : "";
      const NewAll = allUsers;
      j ? NewAll.splice(i, 1, j) : "";
      setAllUsers([...NewAll]);
      setUnfromBlock(null);
    };
  }, [unfromBlock]);

  useEffect(() => {
    if (toBlock)
    {
      sendMessage("toBlock", {
        blockTo: +toBlock.id,
        blockFrom: +id,
      } as any )
      async function blockUser() {
        try {
          if (toBlock) { const res = await Fetch.postBlock(user.token, toBlock.id, +user.userId)};
        } catch(err) {console.log(err)}
      };
      blockUser();
      if (onlineUsers && onlineUsers.find(userX => +userX.userId.userId === +toBlock.id)) {
        const i = allUsers.findIndex(userX => +userX.id === +toBlock.id);
        const j = getUser(+id);
        j ? toBlock.blockedFrom.push(j) : "";
        const NewAll = allUsers;
        NewAll.splice(i, 1, toBlock);
        setAllUsers([...NewAll]);
      }
      if (otherUsers && otherUsers.find(user => +user.id === +toBlock.id)) {
        const i = otherUsers.findIndex(user => +user.id === +toBlock.id);
        const j = getUser(+id)
        j ? toBlock.blockedFrom.push(j) : "";
        const NewOthers = otherUsers;
        NewOthers.splice(i, 1, toBlock);
        setOtherUsers([...NewOthers]);
      }
      if (currentDirect && toBlock && +currentDirect.id === +toBlock.id)
        {setCurrentDirect(null)};
      setToBlock(null);
    }
  }, [toBlock]);

  useEffect(() => {
    if (toUnblock)
    {
      sendMessage("toUnblock", {
        blockTo: +toUnblock.id,
        blockFrom: +id,
      } as any)
      async function unblockUser() {
        try {
          if (toUnblock) { const res = await Fetch.postUnblock(user.token, toUnblock.id, +user.userId)};
        } catch(err) {console.log(err)}
      };
      unblockUser();
      if (onlineUsers && onlineUsers.find(userX => +userX.userId.userId === +toUnblock.id)) {
        const i = allUsers.findIndex(userX => +userX.id === +toUnblock.id);
        toUnblock.blockedFrom = toUnblock.blockedFrom.filter((u: UserChat) => +u.id !== +user.userId);
    //    toUnblock.blockedFrom = toUnblock.blockedFrom.filter((i: number) => +i !== +user.userId);
        const NewAll = allUsers;
        NewAll.splice(i, 1, toUnblock);
        setAllUsers([...NewAll]);
      }
      if (otherUsers && otherUsers.find(user => +user.id === +toUnblock.id)) {
        const i = otherUsers.findIndex(user => +user.id === +toUnblock.id);
        toUnblock.blockedFrom = toUnblock.blockedFrom.filter((u: UserChat) => +u.id !== +user.userId);
        const NewOthers = otherUsers;
        NewOthers.splice(i, 1, toUnblock);
        setOtherUsers([...NewOthers]);
      }
      setToUnblock(null);
    }
  }, [toUnblock]);

  useEffect(() => {
    if (blockForMe && allUsers && allUsers.find(userX => +userX.id === +blockForMe)) {
      const i = allUsers.findIndex(userX => +userX.id === +blockForMe);
      const j = getUser(+id);
      const k = allUsers.find(userX => +userX.id === +blockForMe);
      if (j && k)
      {
        k.blockedFrom.push(j);
        const NewAll = allUsers;
        NewAll.splice(i, 1, k);
        setAllUsers([...NewAll]);}
    }
    setBlockForMe(null);
  }, [blockForMe]);

  useEffect(() => {
    if (unblockForMe && allUsers && user.userId && unblockForMe !== (undefined || null) && unblockForMe !== +user.userId) {
      const i = allUsers.findIndex(userX => +userX.id === +unblockForMe);
      const k = allUsers.find(userX => +userX.id === +unblockForMe);
      if (k) {
        k.blockedFrom = k.blockedFrom.filter((u: UserChat) => +u.id !== +user.userId);
        const NewAll = allUsers;
        NewAll.splice(i, 1, k);
        setAllUsers([...NewAll]);};
    }
    setBlockForMe(null);
  }, [unblockForMe]);

  const getUser  = (userId: number): UserChat | null => {
    const a = allUsers.find(user => +user?.id === +userId);
    if (a !== undefined)
    { return(a)}
    return (null);
  };

  function isHeBlocked(userXid: number): true | undefined {
    const i = getUser(userXid);
    if (i && i.blockedFrom && !i?.blockedFrom.find((u: UserChat) => (+id === +u?.id))) {
       return (true);
    };
  }

  const getDirect = (userX: any): void => {
    const gUser = getUser(+id);
    const dUser = userX.userId ? getUser(userX.userId) : userX;
    if (dUser && gUser && (gUser.blockedFrom.find((u: UserChat) => +u.id === +dUser.id) === undefined ))
    {
      if (dUser.blockedFrom.find((u: UserChat) => +u.id === +id) === undefined)
      {
        setCurrentDirect(dUser);
        setCurrentChat(null);
      }
    }
  }

  const inviteGame = (playerId :number ) => {
    console.log(playerId);
    sendMessage("InviteGame", {
      author: getUser(+id),
      player: getUser(+playerId),
    } as any);
  }

	const [activeTab, setActiveTab] = useState<string>(() => {
		const storedValue = localStorage.getItem("activeTab");
		return storedValue !== null ? storedValue : "Direct messages";
	  });
	const [isJoined, setIsJoined] = useState(false);
	const [isChannelClicked, setIsChannelClicked] = useState(false);
	const [showUsersOnChannel, setShowUsersOnChannel] = useState<boolean>(true);
	const [showInteractiveList, setShowInteractiveList] = useState<boolean>(false);
	const [showUserList, setShowUserList] = useState<boolean>(false);
	const [UsersList, setUsersList] = useState(null);
	const [unMutedUsers, setUnMutedUsers] = useState<string[]>([]);

	const handleShowList = () => {
	  setShowUsersOnChannel(false);
	  setShowInteractiveList(true);
	}

	const handleShowUserList = () => {
	  setShowUsersOnChannel(false);
	  setShowInteractiveList(false);
	  setShowUserList(true);
	}

	useEffect(() => {
	  addListener("showUsersList", data => setUsersList(data));
	  if (!showUsersOnChannel) {
		  setShowUserList(true);
	  }
	}, [showUsersOnChannel]);

	const handleTabChange = (newValue: string) => {
		localStorage.setItem("activeTab", newValue);
		setActiveTab(newValue);
	  };

	useEffect(() => {
  if (currentChat)
    {
      setShowUserList(false);
      setShowUsersOnChannel(true);
    }
  }, [currentChat]);

	return (
	  <>
	  {" "}
		<div className="messenger">
		  <div className="chatMenu">
			<Tabs
				value={activeTab}
				onChange={(e: any, newValue: string) => handleTabChange(newValue)}
				aria-label="icon position tabs example"
				>
				<Tab icon={<MailIcon />} iconPosition="start" label="Direct messages" value="Direct messages" onClick={handleShowUserList}/>
				<Tab icon={<ChatBubbleIcon />} iconPosition="start" label="Channels" value="Channels" />
			</Tabs>
			{activeTab === 'Channels' && (
			  <UpdateChannelsInList
				currentChat={currentChat}
				setCurrentChat={setCurrentChat}
				/>
			)}
			{activeTab === "Direct messages" && (
			  <UsersWithDirectMessage
				currentDirect={currentDirect}
				setCurrentDirect={setCurrentDirect}
				isHeBlocked={isHeBlocked}
				getDirect={getDirect}
				getUser={getUser}
				setToUnblock={setToUnblock}
        onClick={handleShowList}
				/>
			)}
		  </div>
		  <div className="chatBox">
			<div className="chatBoxW">
			  {currentChat ? (
				<CurrentChannel
					currentChatroom={currentChat}
					allUsers={allUsers}
					isJoined={isJoined}
					setIsJoined={setIsJoined}
					setShowList={handleShowList}
					setUsersList={handleShowUserList}
					setUnMutedUsers={setUnMutedUsers}
					setToMute={props.setToMute}
					setToBan={props.setToBan}
					setCurrentChat={setCurrentChat}
					/>
			) : currentDirect ? (
				<CurrentDirectMessages
					currentDirect={currentDirect}
					allUsers={allUsers}
					setToBlock={setToBlock}
					inviteGame={inviteGame}
					/>
			) : (
				<div className='home-chat'>
					<div className="navbar-welcome"></div>
					<div className='home-msg'>Open a conversation</div>
				</div>
			)}
		</div>
		</div>
			{(!currentChat || showUserList) && (
				<UsersChat
					isHeBlocked={isHeBlocked}
					getDirect={getDirect}
					getUser={getUser}
					inviteGame={inviteGame}
					setToBlock={setToBlock}
					setToUnblock={setToUnblock}
				/>
			)}
			{currentChat && showUsersOnChannel  && (
				<UsersOnChannel
					currentChatroom={currentChat}
					channelId={currentChat?.id}
					channelVisibility={currentChat?.visibility}
					channelName={currentChat?.name}
					isChannelClicked={isChannelClicked}
          setToMute={props.setToMute}
          setToban={props.setToBan}
				/>
			)}
	</div>
    </>
  )
}
export default Chat;
