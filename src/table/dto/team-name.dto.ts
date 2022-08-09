import { IsString } from 'class-validator';

export class TeamNameDto {
  @IsString()
  teamName: string;
}
