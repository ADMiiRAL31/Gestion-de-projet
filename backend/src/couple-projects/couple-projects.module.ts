import { Module } from '@nestjs/common';
import { CoupleProjectsService } from './couple-projects.service';
import { CoupleProjectsController } from './couple-projects.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoupleProjectsController],
  providers: [CoupleProjectsService],
  exports: [CoupleProjectsService],
})
export class CoupleProjectsModule {}
