import { IsNumber, IsMongoId, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDTO {
  @ApiProperty({
    example: '60c72b2f9b1d4c3a3c8e5a3e',
    description: 'Product ID',
  })
  @IsMongoId()
  productId: string;

  @ApiProperty({
    example: 100,
    description: 'Quantity of the product in inventory',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}
