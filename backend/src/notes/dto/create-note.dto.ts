import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export enum NoteCategory {
  TACHE = 'TACHE',
  IDEE = 'IDEE',
  RAPPEL = 'RAPPEL',
  IMPORTANT = 'IMPORTANT',
}

export class CreateNoteDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(NoteCategory)
  category: NoteCategory;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
