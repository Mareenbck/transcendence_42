import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateChatroomDto
{
  id:    number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(45)
  name:  string;
  visibility: string;

  @IsString()
	@IsOptional()
  hash: string;
}

export class ParticipantsOnChannel
{
  role: string;
  status: string;
}