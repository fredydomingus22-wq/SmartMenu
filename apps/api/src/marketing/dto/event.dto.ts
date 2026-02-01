import {
    IsString,
    IsOptional,
    IsBoolean,
    IsDateString,
    IsObject,
} from 'class-validator';

export class CreateEventDto {
    @IsObject()
    name!: Record<string, string>;

    @IsOptional()
    @IsObject()
    description?: Record<string, string>;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsDateString()
    date!: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    ticketLink?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateEventDto {
    @IsOptional()
    @IsObject()
    name?: Record<string, string>;

    @IsOptional()
    @IsObject()
    description?: Record<string, string>;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    ticketLink?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
