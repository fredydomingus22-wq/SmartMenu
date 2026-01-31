import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsUUID,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductValueDto {
  @IsDefined()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name!: any;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name!: any;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}
