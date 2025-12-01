import { IsString, IsEnum, IsBoolean, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export enum AlertType {
  URGENT = 'URGENT',
  WARNING = 'WARNING',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
}

export class CreateAlertDto {
  @IsString()
  @IsOptional()
  userId?: string; // Null = alerte pour tous

  @IsEnum(AlertType)
  type: AlertType;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsString()
  @IsOptional()
  actionUrl?: string;
}
