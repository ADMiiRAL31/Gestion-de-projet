import { PartialType } from '@nestjs/mapped-types';
import { CreateCoupleProjectDto } from './create-couple-project.dto';

export class UpdateCoupleProjectDto extends PartialType(CreateCoupleProjectDto) {}
