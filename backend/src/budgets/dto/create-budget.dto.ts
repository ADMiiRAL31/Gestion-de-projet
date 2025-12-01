import { IsString, IsNumber, IsInt, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  userId: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  budgetAmount: number;

  @IsNumber()
  @Min(0)
  spent?: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Min(2020)
  year: number;
}
