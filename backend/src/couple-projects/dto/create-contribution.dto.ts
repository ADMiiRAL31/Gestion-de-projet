import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContributionDto {
  @IsString()
  projectId: string;

  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  note?: string;
}
