import { IsString } from 'class-validator';

export class UpdatePlayersDto {
  @IsString()
  playerName: string;
}
