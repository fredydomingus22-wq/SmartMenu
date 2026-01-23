import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [TablesController],
  providers: [TablesService, PrismaService],
})
export class TablesModule {}
