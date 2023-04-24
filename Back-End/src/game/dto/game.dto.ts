import { IsNotEmpty, IsNumber } from 'class-validator';

export class GameDto {

  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  playerOneId: number;

  @IsNumber()
  @IsNotEmpty()
  playerTwoId: number;

  @IsNumber()
  @IsNotEmpty()
  winnerId: number;

  @IsNumber()
  @IsNotEmpty()
  score1: number;

  @IsNumber()
  @IsNotEmpty()
  score2: number;

  @IsNotEmpty()
  createdAt: Date;

}

// import { IsNotEmpty, IsNumber } from 'class-validator';

// export class GameDto {

//   @IsNumber()
//   @IsNotEmpty()
//   id: number;

//   @IsNumber()
//   @IsNotEmpty()
//   playerOneId: number;

//   @IsNumber()
//   @IsNotEmpty()
//   playerTwoId: number;

//   @IsNumber()
//   @IsNotEmpty()
//   winnerId: number;

//   @IsNumber()
//   @IsNotEmpty()
//   score1: number;

//   @IsNumber()
//   @IsNotEmpty()
//   score2: number;

//   @IsNotEmpty()
//   createdAt: Date;

// }
