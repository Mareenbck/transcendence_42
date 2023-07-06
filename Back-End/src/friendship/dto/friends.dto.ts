import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

export class FriendsDto {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsNumber()
	@IsNotEmpty()
	requesterId: number;

	@IsNumber()
	@IsNotEmpty()
	receiverId: number;
}


