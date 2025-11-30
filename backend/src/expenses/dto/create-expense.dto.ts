import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export enum ExpenseCategory {
  HOUSING = 'HOUSING',
  UTILITIES = 'UTILITIES',
  INSURANCE = 'INSURANCE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  TRANSPORT = 'TRANSPORT',
  FOOD = 'FOOD',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  OTHER = 'OTHER',
}

export enum BillingPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export class CreateExpenseDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsBoolean()
  @IsOptional()
  isShared?: boolean;

  @IsEnum(ExpenseCategory)
  @IsNotEmpty()
  category: ExpenseCategory;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(BillingPeriod)
  @IsOptional()
  billingPeriod?: BillingPeriod;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  provider?: string;
}
