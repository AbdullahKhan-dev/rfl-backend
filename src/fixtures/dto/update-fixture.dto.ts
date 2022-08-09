import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class UpdateFixtureDto {
  @IsString()
  result: string;
}
