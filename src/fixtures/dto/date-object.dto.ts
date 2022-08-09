import { IsDateString } from 'class-validator';

export class DateObjectDto {
  @IsDateString()
  date: Date;
}
