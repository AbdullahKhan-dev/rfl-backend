import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TeamModule } from 'src/team/team.module';
import { FixturesController } from './fixtures.controller';
import { Fixture } from './fixtures.entity';
import { FixturesService } from './fixtures.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fixture]), AuthModule, TeamModule],
  controllers: [FixturesController],
  providers: [FixturesService],
})
export class FixturesModule {}
