import { IsString } from 'class-validator';

export class CreateProductOptionDto {
  @IsString()
  name!: string;
  description?: string;
  minChoices?: number;
  maxChoices?: number;
  isRequired?: boolean;
  values?: CreateProductOptionValueDto[];
}

export class CreateProductOptionValueDto {
  @IsString()
  name!: string;
  price?: number;
  isAvailable?: boolean;
}
