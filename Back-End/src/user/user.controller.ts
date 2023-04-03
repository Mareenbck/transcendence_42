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
			callback(undefined, `${filename}${extension}`);
		},
	})
}

@Controller('users')
export class UserController {
	constructor(private userService: UserService) { }

	@Get('')
	async getAllUsers() {
		const allUsers = await this.userService.getUsers();
		return allUsers;
	}

  @Get('block/users')
//  @UseGuards(JwtGuard)
  async getAllUsersWithBlocked() {
    const allUsers = await this.userService.getUsersWithBlocked();
    return allUsers;
  }

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

	@Get('/friends/:userId')
	//@UseGuards(JwtGuard)
	async getFriends(@Param('userId') userId: string) {
		const userDto = await this.userService.getFriends(parseInt(userId));
		return userDto;
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

	@Post('restore')
	@UseGuards(JwtGuard)
	async restore(@GetCurrentUserId() id: number) {
		const updatedUser = await this.userService.restoreAvatar(id);
		return (updatedUser);
	}

  @Post("block")
  @UseGuards(JwtGuard)
  async block(@Body() {blockFrom, blockTo}) {
    const updatedUser = await this.userService.block(blockFrom, blockTo);
  return (updatedUser);
  }

  @Post("unblock")
  @UseGuards(JwtGuard)
  async unblock(@Body() {blockFrom, unblockTo}) {
    const updatedUser = await this.userService.unblock(blockFrom, unblockTo);
  return (updatedUser);
  }

	@Get('/:id/avatar')
	@UseGuards(JwtGuard)
	async getAvatar(@GetCurrentUserId() id: number, @Res() res: Response) {
		try {
			const user = await this.userService.getUser(id);
			// >>>> const avatar a mettre dans service
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
