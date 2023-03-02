import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateChatroom2Dto
{
  id:    number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(45)
  name:  string;

  avatar: string;
}
