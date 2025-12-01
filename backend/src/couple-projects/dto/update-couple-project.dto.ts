import { IsString, IsNumber, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProjectStatus {
  IDEA = 'IDEA',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class UpdateCoupleProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  targetAmount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  targetDate?: Date;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsEnum(ProjectPriority)
  @IsOptional()
  priority?: ProjectPriority;
}
