import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// 2FA User DTO
export class TwoFaUserDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	twoFAsecret: string;

	@IsNotEmpty()
	@IsNumber()
	id: number;
}

export class TwoFactorDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	twoFAcode: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsString()
	twoFAsecret: string;
}
