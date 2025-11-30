import { IsString, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoanDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsBoolean()
  @IsOptional()
  isShared?: boolean;

  @IsString()
  label: string;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  remainingAmount: number;

  @IsNumber()
  monthlyPayment: number;

  @IsNumber()
  interestRate: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsOptional()
  lender?: string;
}
