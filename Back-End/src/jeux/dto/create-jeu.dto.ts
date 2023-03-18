
import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateJeuDto {
 id: number;
 winnerId: number;
 playerOneId:  number;
 playerTwoId:  number;
 createdAt: Date;
}

