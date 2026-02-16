import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateDeliveryDto {
  @IsUUID()
  @IsNotEmpty()
  orderId!: string;

  @IsNumber()
  @IsNotEmpty()
  @IsLatitude()
  latitude!: number;

  @IsNumber()
  @IsNotEmpty()
  @IsLongitude()
  longitude!: number;
}
