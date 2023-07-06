import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FortyTwoAuthGuard, JwtGuard } from 'src/auth/guard';

@Module({
	imports: [forwardRef(() => PrismaModule)],
	controllers: [UserController],
	providers: [UserService, JwtGuard, FortyTwoAuthGuard],
	exports: [UserService],
})
export class UserModule {}

