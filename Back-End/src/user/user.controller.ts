import { Body, Controller, ForbiddenException, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard, FortyTwoAuthGuard, JwtGuard, LocalAuthGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../decorators/get-userId.decorator';
import { GetUser } from 'src/auth/decorator';
import { UserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import path = require('path');
import { Response } from 'express';

import { v4 as uuidv4 } from 'uuid';

export const storage = {
	storage: diskStorage({
		destination: process.env.UPLOAD_DIR,
		filename: async (request, file, callback) => {
			const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
			const extension: string = path.parse(file.originalname).ext;
			// const fileExtension = '.' + file.mimetype.split('/')[1];
			// const fileName = uuidv4() + fileExtension;
			callback(undefined, `${filename}${extension}`);
		},
	})
}

@Controller('users')
export class UserController {
	constructor(private userService: UserService) { }

	@Get('/profile/:id')
	@UseGuards(JwtGuard)
	async getMe(@GetCurrentUserId() id: string) {
		const userDto = this.userService.getUser(parseInt(id));
		return userDto;
	}

	@Post('/:id/username')
	@UseGuards(JwtGuard)
	async updateUsername(@GetCurrentUserId() id: string, @Body('username') username: string) {
		try {
		const result = await this.userService.updateUsername(id, username);
			return result;
		} catch {
			throw new ForbiddenException('Username already exists');
		}
	}

	@Post('/update_avatar')
	async updateAvatar(@GetCurrentUserId() id: number, @Body('avatar') newAvatar: string) {
		const result = await this.userService.updateAvatar(id, newAvatar);
		return result;
	}

	@Post('upload')
	@UseGuards(JwtGuard)
	@UseInterceptors(FileInterceptor('file', storage))
	async uploadFile(@UploadedFile() file: any, @GetCurrentUserId() id: number) {
		const updatedUser = await this.userService.updateAvatar(id, file.path);
		return (updatedUser);
	}

	@Get('/:id/avatar')
	@UseGuards(JwtGuard)
	async getAvatar(@GetCurrentUserId() id: number, @Res() res: Response) {
		try {
			const user = await this.userService.getUser(id);
			console.log("user---->")
			console.log(user)
			if (user.avatar) {
				const fileName = path.basename(user.avatar)
				const result = res.sendFile(fileName, { root: process.env.UPLOAD_DIR });
				return result
			}
			else if (!user.ftAvatar && !user.avatar) {
				const fileName = process.env.DEFAULT_AVATAR;
				const result = res.sendFile(fileName, { root: process.env.PATH_DEFAULT_AVATAR });
				return result
			}
		} catch {
			throw new ForbiddenException('Not Found');
		}
	}
}
