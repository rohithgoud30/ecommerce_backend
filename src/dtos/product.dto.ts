import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDTO {
  // The name of the product. This field is required and should be a string with a maximum length of 255 characters.
  @ApiProperty({ description: 'Name of the product', maxLength: 255 })
  @IsString() // Validates that the name is a string
  @IsNotEmpty() // Validates that the name is not empty
  @MaxLength(255) // Ensures the name is at most 255 characters long
  name: string;

  // The price of the product. This field is required and should be a number with up to 2 decimal places.
  @ApiProperty({ description: 'Price of the product', example: 6.99 })
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }) // Validates that the price is a number with up to 2 decimal places
  @IsNotEmpty() // Validates that the price is not empty
  price: number;

  // The description of the product. This field is optional and should be a string with a maximum length of 1000 characters.
  @ApiProperty({
    description: 'Description of the product',
    maxLength: 1000,
    required: false,
  })
  @IsString() // Validates that the description is a string
  @IsOptional() // Indicates that the description is optional
  @MaxLength(1000) // Ensures the description is at most 1000 characters long
  description?: string;
}
