import { Body, Controller, ForbiddenException, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors ,BadRequestException} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../decorators/get-userId.decorator';
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
  @UseGuards(JwtGuard)
  async getAllUsersWithBlocked() {
    const allUsers = await this.userService.getUsersWithBlocked();
    return allUsers;
  }

  @Get('block/:id')
  @UseGuards(JwtGuard)
  async getMeWB(@Param('id') id: number) {
    if (id === undefined || isNaN(id))
    {   throw new BadRequestException('Undefined user ID in getMeWB of users'); }
    const me = await this.userService.getMeWithBlocked(+id);
    return me;
  }

  @Get('games')
  @UseGuards(JwtGuard)
  async getAllUsersWithGames() {
    const allUsers = await this.userService.getUsersWithGames();
    return allUsers;
  }

  @Get('userWith/:id')
  @UseGuards(JwtGuard)
  async getWithDirectMessages(@Param('id') id: number) {
    if (id === undefined || isNaN(id))
    {   throw new BadRequestException('Undefined user ID in getWithDirectMessages of users'); }
    const usersW = await this.userService.getUsersWithMessages(+id);
	return usersW;
	};


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

	@Get('/:id/achievements')
	@UseGuards(JwtGuard)
	async getAchievements(@Param('id') userId: string) {
		const achievements = await this.userService.getUserAchievements(parseInt(userId));
		return achievements;
	}

	@Get('/:id/icon')
	async getIcon(@Param('id') id: string, @Res() res: Response) {
		const icon = await this.userService.getIconAchievement(parseInt(id), res);
		return icon;
	}




}
