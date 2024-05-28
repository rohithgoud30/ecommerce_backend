import { IsNumber, IsMongoId, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDTO {
  // Swagger documentation property for the productId field
  @ApiProperty({
    example: '60c72b2f9b1d4c3a3c8e5a3e', // Example value
    description: 'Product ID', // Description of the field
  })
  // Validator to ensure the field is a valid MongoDB ObjectId
  @IsMongoId()
  productId: string;

  // Swagger documentation property for the quantity field
  @ApiProperty({
    example: 100, // Example value
    description: 'Quantity of the product in inventory', // Description of the field
    minimum: 0, // Minimum value for the field
  })
  // Validator to ensure the field is a number
  @IsNumber()
  // Validator to ensure the number is at least 0
  @Min(0)
  quantity: number;
}
