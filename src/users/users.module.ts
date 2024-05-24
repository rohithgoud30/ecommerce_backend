import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schemas/user.schema';

/**
 * UsersModule is responsible for managing user-related functionalities.
 * It imports necessary dependencies, provides services, and registers controllers.
 */
@Module({
  // Importing the MongooseModule to interact with MongoDB.
  // forFeature method registers the User schema with Mongoose.
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  // Registering the UsersService as a provider.
  providers: [UsersService],
  // Registering the UsersController to handle incoming requests.
  controllers: [UsersController],
  // Exporting the UsersService so it can be used in other modules.
  exports: [UsersService],
})
export class UsersModule {}
