import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from '../schemas/product.schema';

@Module({
  imports: [
    // Importing the Mongoose module and defining the Product schema
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [
    // Registering the ProductsService as a provider to handle business logic
    ProductsService,
  ],
  controllers: [
    // Registering the ProductsController to handle incoming requests
    ProductsController,
  ],
  exports: [
    // Exporting the ProductsService to be used in other modules
    ProductsService,
  ],
})
export class ProductsModule {}
