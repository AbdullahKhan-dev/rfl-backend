import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './table.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [TypeOrmModule.forFeature([Table]), AuthModule, TeamModule],
  providers: [TableService],
  controllers: [TableController],
})
export class TableModule {}
