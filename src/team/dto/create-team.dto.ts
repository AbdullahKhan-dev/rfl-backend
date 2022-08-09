import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  teamName: string;

  @ArrayMinSize(2, { message: 'Team must have more than 2 players' })
  @ArrayMaxSize(10, { message: 'Team must have less than 10 players' })
  @IsArray()
  players: string[];
}
