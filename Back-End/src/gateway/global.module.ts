import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GlobalGateway } from './global.gateway';
import { GlobalService } from './global.service';


@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [GlobalGateway, GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
