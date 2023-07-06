import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  SubscribeMessage, OnGatewayInit,
  WebSocketGateway, OnGatewayDisconnect,
  WebSocketServer, WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GlobalService } from './global.service';
import { ChatService } from '../chat/chat.service';
import { GameService } from '../game/game.service';
import { FriendshipService } from '../friendship/friendship.service';
import { Logger } from "@nestjs/common";
import UsersSockets from "./socket.class";
import { AuthService } from 'src/auth/auth.service';
import { UserService } from "src/user/user.service";
import { UserDto } from 'src/user/dto/user.dto';
import { ChatroomService } from 'src/chat/chatroom2/chatroom2.service';

@WebSocketGateway(
    { cors: ["*"], origin: ["*"], path: "", }
    )


export class GlobalGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GlobalGateway.name);
  private userSockets: UsersSockets;
  constructor(
      private readonly chatroomService: ChatroomService,
      private readonly gameService: GameService,
      private readonly chatService: ChatService,
      private readonly globalService: GlobalService,
      private readonly authService: AuthService,
      private readonly userService: UserService,
	    private readonly friendshipService: FriendshipService,
  ) {
      this.userSockets = new UsersSockets();
  }

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.globalService.server = this.server;
    this.userService.server = this.server;
    this.chatroomService.server = this.server;
    this.gameService.server = this.server;
    this.chatService.server = this.server;
	this.friendshipService.server = this.server;
    this.globalService.userSockets = this.userSockets;
    this.chatService.userSockets = this.userSockets;
    this.gameService.userSockets = this.userSockets;
    this.chatroomService.userSockets = this.userSockets;
    this.friendshipService.userSockets = this.userSockets;
    this.userService.userSockets = this.userSockets;
    this.logger.verbose("globalGateway Initialized");
  }

  async handleConnection(socket: Socket) {
    try {
      const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      socket.data.username = user.username as string;
      socket.data.email = user.email as string;
      socket.data.id = user.id as number;
      this.userSockets.addUser(socket);
    } catch (e) {
        this.userSockets.removeSocket(socket)
        socket.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    this.userSockets.removeSocket(client)
    client.disconnect(true);
  }

  @SubscribeMessage('addUserChat')
  async chatAddUsers(@MessageBody() userId: any, @ConnectedSocket() socket: Socket,): Promise<void>
  {
    if (userId.userId !== null) {
      const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      this.chatService.addUserChat(userId, socket.id)
    }
  }

  @SubscribeMessage('removeUserChat')
  async chatRemoveUsers(@MessageBody() userId: string, @ConnectedSocket() socket: Socket,)
  { this.chatService.removeUserChat(userId) }

  @SubscribeMessage('userRoom')
  async chatUserRoom(@MessageBody() data: {roomId: number, userId: number}, @ConnectedSocket() socket: Socket,): Promise<void>
  {
    if (data.userId !== null) {
      const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      this.chatService.addRoomUser(data.roomId, data.userId, socket.id);
    }
  }

  @SubscribeMessage('sendMessageRoom')
  async chatSendChatM(@MessageBody() message2 : {id: number, authorId: number, chatroomId: number, content: string, createdAt: any}, @ConnectedSocket() socket: Socket,)
  {
    if (message2.authorId !== null) {
      const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
    this.chatService.sendRoomMessage(message2.id, message2.authorId, message2.chatroomId, message2.content, message2.createdAt)
    }
  }

  @SubscribeMessage('sendMessageDirect')
  async chatSendDirectM(@MessageBody() data: {content: string, author: string, receiver: string}, @ConnectedSocket() socket: Socket,): Promise<void>
  {
    if (data.author !== null) {
      const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      this.chatService.sendDirectMessage(data.content, data.author, data.receiver,)
    }
  }

  @SubscribeMessage('sendConv')
  async chatSendConversation(@MessageBody() data: any, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.sendConv(data.channelId, data.name, data.isPublic, data.isPrivate, data.isProtected) };

  @SubscribeMessage('toBlock')
  async chatBlock(@MessageBody() data: {blockFrom: number, blockTo: number}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.chatBlock(data.blockFrom, data.blockTo,) };

  @SubscribeMessage('toUnblock')
  async chatUnblock(@MessageBody() data: {blockFrom: number, blockTo: number}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.chatUnblock(data.blockFrom, data.blockTo,)  };

  @SubscribeMessage('InviteGame')
  async chatInvite(@MessageBody() data: {author: UserDto, player: UserDto}, @ConnectedSocket() socket: Socket,): Promise<void>
  { this.chatService.chatInvite(data.author, data.player,) };

  @SubscribeMessage('joinedChannel')
	async joinChannel(@MessageBody() data: {channelId: any}, @ConnectedSocket() socket: Socket): Promise<void>
  { this.chatService.chatJoinedChannel(data.channelId, socket.id) };

  @SubscribeMessage('leaveChannel')
	async leaveChannel(@MessageBody() data: {id: number}, @ConnectedSocket() socket: Socket): Promise<void>
  { this.chatService.chatLeavedChannel(data.id, socket.id) };

  @SubscribeMessage('inviteToPriv')
	async inviteToPriv(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void>
  { this.chatService.invitedToPriv(data.chatroomId, data.receiverId, socket.id) };

  @SubscribeMessage('acceptedChannelInvite')
	async acceptedToPriv( @MessageBody() data: {id: number}, @ConnectedSocket() socket: Socket): Promise<void>
  { this.chatService.acceptedToPriv(data.id, socket.id) };

  @SubscribeMessage('login')
  async appLogin(@MessageBody() data: {userId: number}, @ConnectedSocket() socket: Socket): Promise<void>
  {
    if (data.userId !== null) {
      const user = await this.authService.verifyAccessToken(socket.handshake.auth.token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      this.chatService.logout();
    };
  }

  @SubscribeMessage('enterGame')
  async enterGame(@ConnectedSocket() socket: Socket): Promise<void>
  { this.gameService.enterGame(socket.data.id, socket); };

  @SubscribeMessage('exitGame')
  async exitGame(@MessageBody() data: {status: number}, @ConnectedSocket() socket: Socket): Promise<void> ///
  { this.gameService.exitGame(socket.data.id, data.status, socket); };

  @SubscribeMessage('acceptGame')
  async acceptGame(@MessageBody() data: {author: number, player: number}, @ConnectedSocket() socket: Socket): Promise<void>
  { this.gameService.acceptGame(data.author, data.player) };

  @SubscribeMessage('refuseGame')
  async refusalGame(@MessageBody() data: {author: number, player: number}, @ConnectedSocket() socket: Socket): Promise<void>
  { this.gameService.refusalGame(data.author, data.player) };

  @SubscribeMessage('InviteGame')
  async gameInvite(@MessageBody() data: {author: UserDto, player: UserDto}, @ConnectedSocket() socket: Socket): Promise<void>
  { this.gameService.gameInvite(data.author, data.player) };

  @SubscribeMessage('playGame')
  async playGame(@MessageBody() data: {roomN: number}, @ConnectedSocket() socket: Socket): Promise<void>
  {
    socket.rooms.forEach(room => socket.leave(room));
    this.gameService.playGame(socket.data.id, data.roomN);
  };

  @SubscribeMessage('listRooms')
  async listRooms(@ConnectedSocket() socket: Socket): Promise<void>
  { this.gameService.sendListRooms(); };

	@SubscribeMessage('updateDemands')
	async updateDemands(@MessageBody() data: any): Promise<void> {
		if (data.status === 'ACCEPTED') {
			const updatedDemand = await this.friendshipService.updateFriendship({demandId: data.id, response: data.status});
			this.server.emit('demandsUpdated', updatedDemand);
		} else if (data.status === 'REFUSED') {
			// const updatedDemand = await this.friendshipService.updateFriendship(updatedDemands);
			await this.friendshipService.deleteRefusedFriendship();
		}
	}

	@SubscribeMessage('removeFriend')
	async removeFriend(@MessageBody() friendId: any, @ConnectedSocket() socket: Socket): Promise<void> {
		const updatedFriendsCurrent = await this.friendshipService.showFriends(friendId);
		const newFriendListCurrent = updatedFriendsCurrent.friendOf
		this.userSockets.emitToId(updatedFriendsCurrent.id, 'removeFriend', newFriendListCurrent)
	}


	@SubscribeMessage('createDemand')
	async createDemand(@MessageBody() receiverId: any ): Promise<void> {
		const pendingDemands = await this.friendshipService.getReceivedFriendships({id: receiverId});
		this.server.emit('pendingDemands', pendingDemands);
	}

  @SubscribeMessage('removeConv')
	async removeConv(@MessageBody() data: {channelId: number }): Promise<void> {
		this.server.emit('deleteChannel', data);
	}

  @SubscribeMessage('showUsersList')
	async showUsersList(@MessageBody() data: any ): Promise<void> {
    const showList = await this.userService.getUsers();
		this.server.emit('showUsersList', showList);
	}

  @SubscribeMessage('toMute')
	async hidePaperPlane(@MessageBody() data: any): Promise<void> {
		const hidePaperPlane = await this.chatroomService.getParticipants(parseInt(data));
		this.server.emit('toMute', hidePaperPlane);
	}

	@SubscribeMessage('logout')
	async appLogout(@MessageBody() data: any): Promise<void> {
		const user = await this.authService.signout({userId: data});
		const allUsers = await this.userService.getUsersWithBlocked();
		this.server.emit('users_status', allUsers);
	}

}
