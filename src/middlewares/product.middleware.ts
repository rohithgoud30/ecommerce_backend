import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProductsService } from '../products/products.service';

@Injectable()
// The ProductMiddleware class implements the NestMiddleware interface
export class ProductMiddleware implements NestMiddleware {
  // Injecting the ProductsService to access product-related operations
  constructor(private readonly productsService: ProductsService) {}

  // The 'use' method is called on every request to which this middleware is applied
  async use(req: Request, res: Response, next: NextFunction) {
    const { method, body } = req;
    const { productId } = body;

    // Check if the request method is POST and if the productId is missing in the request body
    if (method === 'POST' && !productId) {
      // Throw an exception if the productId is required but not provided
      throw new HttpException('Product ID is required', HttpStatus.BAD_REQUEST);
    }

    // If a productId is provided, check if the product exists
    if (productId) {
      const productExists = await this.productsService.findOne(productId);
      if (!productExists) {
        // Throw an exception if the product does not exist
        throw new HttpException('Product does not exist', HttpStatus.NOT_FOUND);
      }
    }

    // Call the next middleware or route handler in the stack
    next();
  }
}
