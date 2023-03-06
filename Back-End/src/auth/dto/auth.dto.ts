import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	username: string;
}

export class Auth42Dto {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;
}

// Auth Tokens DTO
export class AuthTokenDto {
	@IsString()
	@IsNotEmpty()
	access_token: string;

	@IsString()
	@IsNotEmpty()
	refresh_token: string;
}
