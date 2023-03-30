
import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateJeuDto {
	@IsNumber()
	@IsNotEmpty()	
 	id: number;

	@IsNumber()
	@IsNotEmpty()	
 	winnerId: number;

	@IsNumber()
	@IsNotEmpty()
 	playerOneId:  number;

	@IsNumber()
	@IsNotEmpty()
 	playerTwoId:  number;

	@IsNotEmpty()
 	createdAt: Date;
}

