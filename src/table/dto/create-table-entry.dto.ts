import { IsNumberString, IsString } from 'class-validator';

export class CreateTableEntryDto {
  @IsString()
  team: string;

  @IsNumberString()
  won: number;

  @IsNumberString()
  drawn: number;

  @IsNumberString()
  lost: number;
}
