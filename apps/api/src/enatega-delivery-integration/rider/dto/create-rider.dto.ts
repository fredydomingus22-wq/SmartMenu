import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRiderDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
