import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoAuthGuard, JwtGuard } from 'src/auth/guard';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [forwardRef(() => PrismaModule), UserModule],
	controllers: [FriendshipController],
	providers: [FriendshipService],
	exports: [FriendshipService],
})
export class FriendshipModule {}
