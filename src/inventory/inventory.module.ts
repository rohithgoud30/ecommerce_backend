import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory, InventorySchema } from '../schemas/inventory.schema';
import { ProductMiddleware } from '../middlewares/product.middleware';
import { ProductsModule } from '../products/products.module';

@Module({
  // Importing necessary modules and schemas
  imports: [
    // Configuring Mongoose to use the Inventory schema
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
    // Importing the ProductsModule to use its services
    ProductsModule,
  ],
  // Registering the InventoryService as a provider
  providers: [InventoryService],
  // Registering the InventoryController to handle incoming requests
  controllers: [InventoryController],
  // Exporting the InventoryService to be used in other modules
  exports: [InventoryService],
})
export class InventoryModule {
  // Configuring middleware for the module
  configure(consumer: MiddlewareConsumer) {
    // Applying ProductMiddleware to POST requests to the 'inventory' route
    consumer
      .apply(ProductMiddleware)
      .forRoutes({ path: 'inventory', method: RequestMethod.POST });
  }
}
