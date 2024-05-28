import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Inject,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDTO } from '../dtos/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Tagging this controller with 'products' for Swagger documentation
@ApiTags('products')
// Defining the controller and specifying the base route as 'products'
@Controller('products')
export class ProductsController {
  // Injecting the ProductsService to handle product-related business logic
  constructor(
    @Inject(ProductsService) private readonly productsService: ProductsService,
  ) {}

  // API endpoint to get all products
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    schema: {
      example: [
        {
          name: 'Sample Product',
          price: 19.99,
          description: 'A sample product description.',
          _id: 'productId',
        },
      ],
    },
  })
  @Get()
  async findAll() {
    try {
      // Fetching all products from the service
      return await this.productsService.findAll();
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        'Failed to retrieve products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // API endpoint to get a product by ID
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    schema: {
      example: {
        name: 'Sample Product',
        price: 19.99,
        description: 'A sample product description.',
        _id: 'productId',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid product ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  // API endpoint to create a new product, protected by JWT authentication
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: ProductDTO,
    description: 'Product data',
    examples: {
      example1: {
        value: {
          name: 'Sample Product',
          price: 19.99,
          description: 'A sample product description.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    schema: {
      example: {
        name: 'Sample Product',
        price: 19.99,
        description: 'A sample product description.',
        _id: 'generatedProductId',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() product: ProductDTO) {
    return await this.productsService.create(product);
  }

  // API endpoint to update a product by ID, protected by JWT authentication
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({
    type: ProductDTO,
    description: 'Product data',
    examples: {
      example1: {
        value: {
          name: 'Updated Product',
          price: 29.99,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    schema: {
      example: {
        name: 'Updated Product',
        price: 29.99,
        description: 'A sample product description.',
        _id: 'productId',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid product ID' })
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() product: Partial<ProductDTO>) {
    return await this.productsService.update(id, product);
  }

  // API endpoint to delete a product by ID, protected by JWT authentication
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
    schema: {
      example: {
        name: 'Sample Product',
        price: 19.99,
        description: 'A sample product description.',
        _id: 'productId',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid product ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
