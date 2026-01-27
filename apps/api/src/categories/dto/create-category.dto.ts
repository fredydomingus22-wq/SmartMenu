import { IsDefined, IsOptional, IsEnum } from 'class-validator';

export class CreateCategoryDto {
  @IsDefined()
  name!: any;

  @IsOptional()
  @IsEnum(['KITCHEN', 'BAR'])
  preparationSector?: 'KITCHEN' | 'BAR';
}
