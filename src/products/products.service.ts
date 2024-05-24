import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { ProductDTO } from '../dtos/product.dto';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      this.logger.error('Error finding all products', error);
      throw new HttpException(
        'Failed to retrieve products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
      }
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      this.logger.error(`Error finding product with id ${id}`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(product: ProductDTO): Promise<Product> {
    try {
      const createdProduct = new this.productModel(product);
      return await createdProduct.save();
    } catch (error) {
      this.logger.error('Error creating product', error);
      if (error.code === 11000) {
        throw new HttpException(
          'Product with this name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, product: Partial<ProductDTO>): Promise<Product> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
      }
      const existingProduct = await this.productModel
        .findOne({ name: product.name })
        .exec();
      if (existingProduct && existingProduct._id.toString() !== id) {
        throw new HttpException(
          'Product with this name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, product, { new: true })
        .exec();
      if (!updatedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Error updating product with id ${id}`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
      }
      const deletedProduct = await this.productModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return deletedProduct;
    } catch (error) {
      this.logger.error(`Error deleting product with id ${id}`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
