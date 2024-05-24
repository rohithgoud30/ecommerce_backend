import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductMiddleware implements NestMiddleware {
  constructor(private readonly productsService: ProductsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, body } = req;
    const { productId } = body;

    if (method === 'POST' && !productId) {
      throw new HttpException('Product ID is required', HttpStatus.BAD_REQUEST);
    }

    if (productId) {
      const productExists = await this.productsService.findOne(productId);
      if (!productExists) {
        throw new HttpException('Product does not exist', HttpStatus.NOT_FOUND);
      }
    }

    next();
  }
}
