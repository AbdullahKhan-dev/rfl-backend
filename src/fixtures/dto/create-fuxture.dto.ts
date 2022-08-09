import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TeamsEnum } from 'src/teams.enum';

export class CreateFixtureDto {
  @IsString()
  homeTeam: string;

  @IsString()
  awayTeam: string;

  @IsDateString()
  date: Date;
}
