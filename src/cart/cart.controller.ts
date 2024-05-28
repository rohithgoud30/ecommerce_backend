import {
  Controller,
  Get,
  Put,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartItemDTO } from '../dtos/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@ApiTags('cart')
// Defining the controller and specifying the base route as 'cart'
@Controller('cart')
export class CartController {
  // Injecting the CartService to handle cart-related operations
  constructor(private readonly cartService: CartService) {}

  // API endpoint to get all carts
  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({
    status: 200,
    description: 'List of all carts',
    schema: {
      example: [
        {
          _id: '60c72b2f9b1d4c3a3c8e5a40',
          userId: '60c72b2f9b1d4c3a3c8e5a3f',
          items: [
            {
              productId: '60c72b2f9b1d4c3a3c8e5a3e',
              quantity: 2,
            },
          ],
        },
      ],
    },
  })
  @Get('all')
  async findAll() {
    try {
      // Fetching all carts from the service
      return await this.cartService.findAll();
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        'Failed to retrieve carts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // API endpoint to get the cart of the authenticated user
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({
    status: 200,
    description: 'The cart of the authenticated user',
    schema: {
      example: {
        _id: '60c72b2f9b1d4c3a3c8e5a40',
        userId: '60c72b2f9b1d4c3a3c8e5a3f',
        items: [
          {
            productId: '60c72b2f9b1d4c3a3c8e5a3e',
            quantity: 2,
          },
        ],
      },
    },
  })
  @Get()
  async findOrCreate(@Request() req: ExpressRequest) {
    try {
      const userId = req.user['_id'];
      return await this.cartService.findOrCreate(userId);
    } catch (error) {
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        'Failed to retrieve or create cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // API endpoint to update the cart of the authenticated user
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user cart' })
  @ApiBody({
    type: [CartItemDTO],
    description: 'Array of cart items to be added or updated',
    examples: {
      example1: {
        value: [
          {
            productId: '60c72b2f9b1d4c3a3c8e5a3e',
            quantity: 2,
          },
          {
            productId: '60c72b2f9b1d4c3a3c8e5a3f',
            quantity: 1,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The cart has been successfully updated.',
    schema: {
      example: {
        _id: '60c72b2f9b1d4c3a3c8e5a40',
        userId: '60c72b2f9b1d4c3a3c8e5a3f',
        items: [
          {
            productId: '60c72b2f9b1d4c3a3c8e5a3e',
            quantity: 4,
          },
          {
            productId: '60c72b2f9b1d4c3a3c8e5a3f',
            quantity: 1,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Put()
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Request() req: ExpressRequest, @Body() items: CartItemDTO[]) {
    try {
      const userId = req.user['_id'];
      return await this.cartService.update(userId, items);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Handling errors and throwing an HTTP exception
      throw new HttpException(
        'Failed to update cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
