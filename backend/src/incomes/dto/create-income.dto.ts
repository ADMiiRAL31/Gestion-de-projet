import { IsString, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncomeDto {
  @IsString()
  userId: string;

  @IsString()
  type: string; // salary, bonus, freelance, investment, other

  @IsString()
  label: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;
}
