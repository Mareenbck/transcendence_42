
import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateGameDto {
 id: number;
 finishedAt: Date;
 playerOneOnGameId:  number
 playerTwosOnGameId:  number
 createdAt: Date;
}

