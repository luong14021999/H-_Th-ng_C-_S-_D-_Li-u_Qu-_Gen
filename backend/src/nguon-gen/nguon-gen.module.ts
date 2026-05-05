import { Module } from '@nestjs/common';
import { NguonGenService } from './nguon-gen.service';
import { NguonGenController } from './nguon-gen.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [NguonGenController],
  providers: [NguonGenService, PrismaService],
})
export class NguonGenModule {}
