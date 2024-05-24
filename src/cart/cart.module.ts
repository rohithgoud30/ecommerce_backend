import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from '../schemas/cart.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  // Importing the MongooseModule and defining the Cart schema
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule, // Import the ProductsModule to make ProductsService available
  ],
  // Providing the CartService to be used in other parts of the application
  providers: [CartService],
  // Defining the CartController to handle incoming HTTP requests
  controllers: [CartController],
  // Exporting the CartService to make it available outside this module
  exports: [CartService],
})
export class CartModule {}
