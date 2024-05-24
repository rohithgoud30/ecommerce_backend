import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CartModule } from './cart/cart.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

/**
 * The root module of the application, responsible for bootstrapping the application.
 */
@Module({
  imports: [
    /**
     * ConfigModule: Loads environment variables from a .env file and makes them available globally.
     * The `isGlobal: true` option makes the configuration available across the entire application.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * Importing other feature modules which encapsulate specific areas of the application.
     * Each module is responsible for a specific domain of the application.
     */
    ProductsModule,
    UsersModule,
    CartModule,
    InventoryModule,
    DatabaseModule,
    AuthModule,
  ],

  /**
   * Controllers to be instantiated within this module.
   * AppController is responsible for handling incoming requests and returning responses.
   */
  controllers: [AppController],

  /**
   * Providers to be instantiated within this module.
   * AppService contains business logic to be used across the application.
   */
  providers: [AppService],
})
export class AppModule {}
