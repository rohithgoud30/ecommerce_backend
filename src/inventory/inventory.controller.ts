import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Inject,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDTO } from '../dtos/create-inventory.dto';
import { UpdateInventoryDTO } from '../dtos/update-inventory.dto';
import { ProductsService } from '../products/products.service';

@ApiTags('inventory')
// Defining the controller and specifying the base route as 'inventory'
@Controller('inventory')
export class InventoryController {
  // Injecting the InventoryService and ProductsService to handle inventory-related and product-related operations
  constructor(
    @Inject(InventoryService)
    private readonly inventoryService: InventoryService,
    @Inject(ProductsService)
    private readonly productsService: ProductsService,
  ) {}

  // API endpoint to get all inventory items
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({
    status: 200,
    description: 'List of all inventory items',
  })
  @Get()
  async findAll() {
    try {
      // Fetching all inventory items from the service
      return await this.inventoryService.findAll();
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        'Failed to retrieve inventory items',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // API endpoint to create a new inventory item
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiBody({
    type: CreateInventoryDTO,
    description: 'Inventory data',
  })
  @ApiResponse({
    status: 201,
    description: 'The inventory item has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() inventory: CreateInventoryDTO) {
    try {
      // Check if the product exists
      const product = await this.productsService.findOne(inventory.productId);
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      // Create the inventory item using the service
      return await this.inventoryService.create(inventory);
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        error.message || 'Failed to create inventory item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // API endpoint to update an inventory item by ID
  @ApiOperation({ summary: 'Update an inventory item by ID' })
  @ApiBody({
    type: UpdateInventoryDTO,
    description: 'Inventory data',
  })
  @ApiResponse({
    status: 200,
    description: 'The inventory item has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() inventory: UpdateInventoryDTO) {
    try {
      // Update the inventory item using the service
      const updatedInventory = await this.inventoryService.update(
        id,
        inventory,
      );
      if (!updatedInventory) {
        throw new HttpException(
          'Inventory item not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedInventory;
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        error.message || 'Failed to update inventory item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // API endpoint to add or update inventory quantity
  @ApiOperation({ summary: 'Add or update inventory quantity' })
  @ApiBody({
    type: UpdateInventoryDTO,
    description: 'Inventory data',
  })
  @ApiResponse({
    status: 200,
    description: 'The inventory item quantity has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('update-quantity/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async addOrUpdateQuantity(
    @Param('id') id: string,
    @Body() inventory: UpdateInventoryDTO,
  ) {
    try {
      // Add or update the inventory quantity using the service
      const updatedInventory = await this.inventoryService.addOrUpdateQuantity(
        id,
        inventory,
      );
      return updatedInventory;
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        error.message || 'Failed to update inventory quantity',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // API endpoint to reset inventory quantity by ID
  @ApiOperation({ summary: 'Reset inventory quantity by ID' })
  @ApiResponse({
    status: 200,
    description: 'The inventory item quantity has been successfully reset.',
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('reset-quantity/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetQuantity(@Param('id') id: string) {
    try {
      // Reset the inventory quantity using the service
      const updatedInventory = await this.inventoryService.resetQuantity(id);
      if (!updatedInventory) {
        throw new HttpException(
          'Inventory item not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedInventory;
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        error.message || 'Failed to reset inventory quantity',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // API endpoint to delete an inventory item by ID
  @ApiOperation({ summary: 'Delete an inventory item by ID' })
  @ApiResponse({
    status: 200,
    description: 'The inventory item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      // Delete the inventory item using the service
      const deletedInventory = await this.inventoryService.remove(id);
      if (!deletedInventory) {
        throw new HttpException(
          'Inventory item not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return deletedInventory;
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        error.message || 'Failed to delete inventory item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
