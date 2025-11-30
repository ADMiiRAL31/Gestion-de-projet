import { IsString, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecurringExpenseDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsBoolean()
  @IsOptional()
  isShared?: boolean;

  @IsString()
  category: string; // rent, insurance, phone, subscription, loan_payment, utilities, transport, other

  @IsString()
  label: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  billingPeriod: string; // monthly, yearly, quarterly, weekly

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  provider?: string;
}
