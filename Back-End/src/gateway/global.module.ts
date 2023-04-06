import { Module } from '@nestjs/common';
import { GlobalService } from './global.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [GlobalService]
})
export class GlobalModule {}
