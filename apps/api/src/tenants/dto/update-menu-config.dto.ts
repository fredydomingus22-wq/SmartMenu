import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MenuSectionDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  type!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: Record<string, any>;
}

export class UpdateMenuConfigDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuSectionDto)
  sections!: MenuSectionDto[];
}
