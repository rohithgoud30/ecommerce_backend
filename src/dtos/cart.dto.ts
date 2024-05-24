import {
  IsNotEmpty,
  IsArray,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// DTO for individual items in the cart
export class CartItemDTO {
  @ApiProperty({
    example: '60c72b2f9b1d4c3a3c8e5a3e',
    description: 'Product ID',
  })
  @IsMongoId() // Validates that the productId is a valid MongoDB ObjectId
  @IsNotEmpty() // Validates that the productId is not empty
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  @IsNotEmpty() // Validates that the quantity is not empty
  quantity: number;
}

// DTO for the entire cart
export class CartDTO {
  @ApiProperty({ example: '60c72b2f9b1d4c3a3c8e5a3f', description: 'User ID' })
  @IsMongoId() // Validates that the userId is a valid MongoDB ObjectId
  @IsNotEmpty() // Validates that the userId is not empty
  userId: string;

  @ApiProperty({ type: [CartItemDTO], description: 'List of cart items' })
  @IsArray() // Validates that items is an array
  @ValidateNested({ each: true }) // Validates each item in the array
  @Type(() => CartItemDTO) // Specifies the type of each item in the array
  items: CartItemDTO[];
}
