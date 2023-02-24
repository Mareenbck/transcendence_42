import { Module,forwardRef } from '@nestjs/common';
import { DirMessController } from './dir-mess.controller';
import { DirMessService } from './dir-mess.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [forwardRef(() => PrismaModule)],
  controllers: [DirMessController],
  providers: [DirMessService]
})
export class DirMessModule {}
