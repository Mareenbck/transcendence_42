import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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

// Auth Tokens DTO
export class AuthTokenDto {
	@IsString()
	@IsNotEmpty()
	access_token: string;

	@IsString()
	@IsNotEmpty()
	refresh_token: string;
}
