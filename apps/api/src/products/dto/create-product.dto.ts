import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject,
  IsUUID,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductValueDto {
  @IsDefined()
  name!: any;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class CreateProductOptionFromProductDto {
  @IsDefined()
  name!: any;

  @IsOptional()
  description?: any;

  @IsNumber()
  @IsOptional()
  minChoices?: number;

  @IsNumber()
  @IsOptional()
  maxChoices?: number;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductValueDto)
  values!: CreateProductValueDto[];
}

export class CreateProductDto {
  @IsDefined()
  name!: any;

  @IsOptional()
  description?: any;

  @IsNumber()
  price!: number;

  @IsUUID()
  categoryId!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionFromProductDto)
  @IsOptional()
  options?: CreateProductOptionFromProductDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  upsells?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  recommendations?: string[];

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
