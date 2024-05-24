import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../schemas/cart.schema';
import { CartItemDTO } from '../dtos/cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(): Promise<Cart[]> {
    try {
      return await this.cartModel.find().exec();
    } catch (error) {
      this.logger.error('Error finding all carts', error);
      throw new HttpException(
        'Failed to retrieve carts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOrCreate(userId: string): Promise<Cart> {
    try {
      let cart = await this.cartModel.findOne({ userId }).exec();
      if (!cart) {
        cart = new this.cartModel({ userId, items: [] });
        await cart.save();
      }
      return cart;
    } catch (error) {
      this.logger.error('Error finding or creating cart', error);
      throw new HttpException(
        'Failed to retrieve or create cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(userId: string, items: CartItemDTO[]): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({ userId }).exec();
      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }

      for (const item of items) {
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          throw new HttpException(
            `Product with ID ${item.productId} not found`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const productId = new Types.ObjectId(item.productId);
        const existingItem = cart.items.find((i) =>
          i.productId.equals(productId),
        );
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cart.items.push({ productId, quantity: item.quantity });
        }
      }

      return await cart.save();
    } catch (error) {
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
