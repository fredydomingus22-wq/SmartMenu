import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateProductGroupDto {
  @IsObject()
  name!: Record<string, string>;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}

export class UpdateProductGroupDto {
  @IsOptional()
  @IsObject()
  name?: Record<string, string>;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}
