import { IsEnum, IsString } from 'class-validator';
import { TeamsEnum } from 'src/teams.enum';
import { ResultEnum } from '../result.enum';

export class UpdateResultDto {
  @IsString()
  teamName: string;

  @IsString()
  thisResult: string;
}
