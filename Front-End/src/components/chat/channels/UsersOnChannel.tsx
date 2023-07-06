import * as React from 'react';
import { useEffect, useContext } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AuthContext from '../../../store/AuthContext';
import "../../../style/UsersOnChannel.css"
import PersonnalInfoChat from '../PersonnalInfoChat';
import { Avatar, Tooltip } from '@mui/material';
import "../../../style/UsersChat.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FriendContext } from "../../../store/FriendshipContext";
import { faTrash, faBan, faMicrophoneSlash, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import useSocket from '../../../service/socket';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function InteractiveListe(props: any) {
    const friendCtx = React.useContext(FriendContext);
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const authCtx = useContext(AuthContext);
    const [isBanned, setIsBanned] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [participants, setParticipants] = React.useState<any []>([]);
    const admins = participants.filter((p: any) => p.role === 'ADMIN');
    const owner = participants.filter((p: any) => p.role === 'OWNER');
    const users = participants.filter((p: any) => p.role === 'USER');
    const [sendMessage, addListener] = useSocket();


	const showParticipants = React.useCallback(async (channelId: string) => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/chatroom2/${channelId}/participants`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authCtx.token}`
					}
				}
			);
			if (response.ok) {
				const data = await response.json();
				const updatedUsersOnChannel = await Promise.all(data.map(async (userOnChannel: any) => {
					const avatar = await friendCtx.fetchAvatar(userOnChannel.user.id);
					return {
						...userOnChannel,
						user: {
						  ...userOnChannel.user,
						  avatar: avatar
						}
					  };
				}));
				setParticipants(updatedUsersOnChannel);
			}
		} catch (err) {
			console.log(err)
		}
	}, [authCtx.token]);

	useEffect(() => {
		addListener("changeParticipants", () => {
            showParticipants(props.channelId);
		});
	});

	const kickSomeone = async (channelId: string, userId: string) => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/chatroom2/${channelId}/kick/${userId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authCtx.token}`,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to kick user.");
			}
			const data = await response.json();
			const updatedParticipants = participants.filter(p => p.user.id !== userId);
			setParticipants(updatedParticipants);
			showParticipants(channelId);
			sendMessage('toMute', data.channelId)
			sendMessage("sendConv", data)
		} catch (error) {
			console.error(error);
		}
	};

    const banSomeone = async (channelId: string, userId: string) => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/chatroom2/${channelId}/ban/${userId}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authCtx.token}`,
					},

				});
			if (!response.ok) {
				throw new Error("Failed to ban user.");
			}
			const data = await response.json();
			setParticipants(data)
			const updatedParticipants = participants.filter(p => p.user.id !== userId);
			setParticipants(updatedParticipants);
			showParticipants(channelId);
			setIsBanned(true)
			sendMessage('toMute', data.channelId)
		} catch (error) {
			console.error(error);
		}
	};

	const unBanSomeone = async (channelId: string, userId: string) => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/chatroom2/${channelId}/unban/${userId}`,{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authCtx.token}`,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to unban user.");
			}
			const data = await response.json();
			setParticipants(data)
			const updatedParticipants = participants.filter(p => p.user.id !== userId);
			setParticipants(updatedParticipants);
			showParticipants(channelId);
			setIsBanned(false)
			sendMessage('toMute', data.channelId)
		} catch (error) {
			console.error(error);
		}
	};

	const muteSomeone = async (channelId: string, userId: string) => {
		try {
			const response = await fetch(
				"http://" + window.location.hostname + ':3000'  + `/chatroom2/${channelId}/mute/${userId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authCtx.token}`,
					},
				});
			if (!response.ok) {
				throw new Error("Failed to mute user.");
			}
			const data = await response.json();
			console.log("MUTE DATA ", data)
			const updatedUsersOnChannel = await Promise.all(data.map(async (userOnChannel: any) => {
				const avatar = await friendCtx.fetchAvatar(userOnChannel.user.id);
				return {
					...userOnChannel,
					user: {
						...userOnChannel.user,
						avatar: avatar
					}
				};
			}));
			setParticipants(updatedUsersOnChannel)
			setIsMuted(true);
			sendMessage('toMute', data[0].channelId)
		} catch (error) {
			console.error(error);
		}
	};

	const unMuteSomeone = async (channelId: string, userId: string) => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/chatroom2/${channelId}/unmute/${userId}`,{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authCtx.token}`,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to mute user.");
			}
			const data = await response.json();
			setIsMuted(false)
			const updatedUsersOnChannel = await Promise.all(data.map(async (userOnChannel: any) => {
				const avatar = await friendCtx.fetchAvatar(userOnChannel.user.id);
				return {
					...userOnChannel,
					user: {
						...userOnChannel.user,
						avatar: avatar
					}
					};
			}));
			setParticipants(updatedUsersOnChannel)
			sendMessage('toMute', data[0].channelId)
		} catch (error) {
			console.error(error);
		}
	};

        useEffect(() => {
            showParticipants(props.channelId);
        }, [props.channelId]);


	useEffect(() => {
		addListener('toMute', async data => {
			const updatedUsersOnChannel = await Promise.all(data.map(async (userOnChannel: any) => {
				const avatar = await friendCtx.fetchAvatar(userOnChannel.user.id);
				return {
					...userOnChannel,
					user: {
						...userOnChannel.user,
						avatar: avatar
					}
					};
			}));
			setParticipants(updatedUsersOnChannel)
		})
	}, [addListener])



	function isHeMuted(id: number): true | undefined {
		const muted = participants.filter((p: any) => p.userId === id && p.status === 'MUTE').length > 0
		if (muted) {
			return true
		}
	}

	function isHeBanned(id: number): true | undefined {
		const banned = participants.filter((p: any) => p.userId === id && p.status === 'BAN').length > 0
		if (banned) {
			return true
		}
	}

    return (
        <Box className="participants-container" style={{ backgroundColor: '#f2f2f2'}} sx={{ flexGrow: 1, maxWidth: 752 }}>
        <PersonnalInfoChat style="channel"/>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Participants of {props.channelName}
        </Typography>
        <Demo style={{ backgroundColor: '#f2f2f2' }}>
        <List dense={dense}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Owner Gros Boss
            </Typography>
            {owner.map((participants: any) => (
                <ListItem key={participants.user.username}
                secondaryAction={
                    <div>
                    <i className="fa-sharp fa-solid fa-crown"></i>
                    </div>
                }
                >
                <ListItemAvatar>
                    <Avatar variant="rounded" className="users-chatlist-avatar" src={participants.user.avatar ? participants.user.avatar : participants.user.ftAvatar} />
                </ListItemAvatar>
                <ListItemText
                    primary={participants?.user.username}
                    secondary={secondary ? 'Secondary text' : null}
                    />
                </ListItem>
            ))}
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Admins
            </Typography>
            {admins.map((participants: any) => (
                <ListItem key={participants.user.username}
                secondaryAction={
                    <div>
                        <i className="fa-sharp fa-solid fa-crown"></i>
                    </div>
                }
                >
                <ListItemAvatar>
                    <Avatar variant="rounded" className="users-chatlist-avatar" src={participants.user.avatar ? participants.user.avatar : participants.user.ftAvatar} />
                </ListItemAvatar>
                <ListItemText
                    primary={participants?.user.username}
                    secondary={secondary ? 'Secondary text' : null}
                    />
                </ListItem>
            ))}
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Users
                </Typography>
            {users.map((participants: any) => (
                <ListItem key={participants.user.username} className={`username ${isHeBanned(participants.user.id) ? 'banned' : ''}`}>
                <ListItemAvatar>
                    <Avatar variant="rounded" className="users-chatlist-avatar"  src={participants.user.avatar ? participants.user.avatar : participants.user.ftAvatar} />
                </ListItemAvatar>
                <ListItemText
                    primary={participants?.user.username}
                    secondary={secondary ? 'Secondary text' : null}
                />
                {/* {showList} */}
                {(admins.concat(owner)).some(admin => admin.user.id === authCtx.userId) && (
                <>
                    <Tooltip title="Kick">
                        <FontAwesomeIcon icon={faTrash} onClick={() => kickSomeone(props.channelId, participants.user.id)} className={`btn-chatlist`}/>
                    </Tooltip>
                    {props.channelVisibility === 'PUBLIC' || props.channelVisibility === 'PWD_PROTECTED' ? (
                    <div>
                        {!isHeBanned(participants.user.id) ? (
                        <Tooltip title="Ban">
                            <FontAwesomeIcon
                            icon={faBan}
                            onClick={() => banSomeone(props.channelId, participants.user.id)}
                            className={`btn-chatlist ban`}
                            />
                        </Tooltip>
                        ) : (
                        <Tooltip title="UnBan">
                            <FontAwesomeIcon
                            icon={faBan}
                            onClick={() => unBanSomeone(props.channelId, participants.user.id)}
                            className={`btn-chatlist-clicked`}
                            />
                        </Tooltip>
                        )}

                    </div>
                    ) : null}
                    {!isHeMuted(participants.user.id) ? (
                        <Tooltip title="Mute">
                            <FontAwesomeIcon
                                icon={faMicrophone}
                                onClick={() => muteSomeone(props.channelId, participants.user.id)}
                                className={`btn-chatlist mute`}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Unmute">
                            <FontAwesomeIcon
                                icon={faMicrophoneSlash}
                                onClick={() => unMuteSomeone(props.channelId, participants.user.id)}
                                className={`btn-chatlist mute`}
                            />
                        </Tooltip>
                    )}
				</>
                )}
                </ListItem>
            ))}
        </List>
        </Demo>
    </Box>
    );
}
