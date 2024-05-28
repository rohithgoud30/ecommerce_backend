import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../schemas/cart.schema';
import { CartItemDTO } from '../dtos/cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
// CartService handles all business logic related to shopping carts
export class CartService {
  // Creating a logger instance for logging messages
  private readonly logger = new Logger(CartService.name);

  constructor(
    // Injecting the Cart model to interact with the MongoDB collection
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    // Injecting the ProductsService to verify product existence
    private readonly productsService: ProductsService,
  ) {}

  // Method to find and return all carts
  async findAll(): Promise<Cart[]> {
    try {
      return await this.cartModel.find().exec();
    } catch (error) {
      // Logging the error and throwing an HTTP exception if the operation fails
      this.logger.error('Error finding all carts', error);
      throw new HttpException(
        'Failed to retrieve carts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Method to find a cart by user ID or create a new one if it doesn't exist
  async findOrCreate(userId: string): Promise<Cart> {
    try {
      let cart = await this.cartModel.findOne({ userId }).exec();
      if (!cart) {
        cart = new this.cartModel({ userId, items: [] });
        await cart.save();
      }
      return cart;
    } catch (error) {
      // Logging the error and throwing an HTTP exception if the operation fails
      this.logger.error('Error finding or creating cart', error);
      throw new HttpException(
        'Failed to retrieve or create cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Method to update a cart with new items or update existing items
  async update(userId: string, items: CartItemDTO[]): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({ userId }).exec();
      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }

      for (const item of items) {
        // Check if the product exists before adding it to the cart
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          throw new HttpException(
            `Product with ID ${item.productId} not found`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // Check if the item already exists in the cart
        const productId = new Types.ObjectId(item.productId);
        const existingItem = cart.items.find((i) =>
          i.productId.equals(productId),
        );
        if (existingItem) {
          // Update the quantity if the item already exists
          existingItem.quantity += item.quantity;
        } else {
          // Add the new item to the cart if it doesn't exist
          cart.items.push({ productId, quantity: item.quantity });
        }
      }

      return await cart.save();
    } catch (error) {
      // Logging the error and throwing an HTTP exception if the operation fails
      this.logger.error('Error updating cart', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
