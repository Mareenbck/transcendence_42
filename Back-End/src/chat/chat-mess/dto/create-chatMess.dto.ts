import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateChatMessDto
{

  id: number;
  chatroomId:    number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content:  string;

  authorId: number;

  createdAt: Date;
}


