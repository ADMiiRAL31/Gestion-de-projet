import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export enum IncomeType {
  SALARY = 'SALARY',
  FREELANCE = 'FREELANCE',
  BONUS = 'BONUS',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export class CreateIncomeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(IncomeType)
  @IsNotEmpty()
  type: IncomeType;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;
}
