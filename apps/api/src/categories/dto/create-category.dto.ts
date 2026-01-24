export class CreateCategoryDto {
  name!: Record<string, string>;
  preparationSector?: 'KITCHEN' | 'BAR';
}
