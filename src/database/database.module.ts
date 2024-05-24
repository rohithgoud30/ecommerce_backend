import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Importing ConfigModule to manage environment variables
    ConfigModule,
    // Setting up MongooseModule to connect to MongoDB asynchronously
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Importing ConfigModule to access environment variables
      useFactory: async (configService: ConfigService) => ({
        // Factory function to create MongoDB connection options
        uri: configService.get<string>('MONGO_URI'), // Getting the MongoDB URI from environment variables
      }),
      inject: [ConfigService], // Injecting ConfigService to access environment variables
    }),
  ],
})
export class DatabaseModule {}
