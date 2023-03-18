import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class DirMessDto
{
  id       : number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content  : string;

  author    : number;
  receiver  : number;
  createdAt: Date;
}

