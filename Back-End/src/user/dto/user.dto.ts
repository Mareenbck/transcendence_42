import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import { DirMessDto } from './../../chat/dir-mess/dir-mess.dto';
import { FriendsDto } from 'src/friendship/dto/friends.dto';

export class UserDto {
	//Data transfer object
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	email: string;

	// @Exclude()
	hash: string;

	// @Exclude()
	hashedRtoken: string;

	avatar: string;
	ftAvatar: string;

	receivedFriendships: FriendsDto[];

	dirMessEmited: DirMessDto[];
}
