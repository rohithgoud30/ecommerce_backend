import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * AuthModule is responsible for handling user authentication and authorization.
 * It imports necessary modules, provides services, and defines controllers.
 */
@Module({
  imports: [
    UsersModule, // Imports the UsersModule to handle user-related operations.
    PassportModule, // Imports the PassportModule to use passport strategies for authentication.
    JwtModule.registerAsync({
      imports: [ConfigModule], // Imports the ConfigModule to use environment variables.
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Retrieves the JWT secret from environment variables.
        signOptions: { expiresIn: '1h' }, // Sets the expiration time for JWT tokens.
      }),
      inject: [ConfigService], // Injects the ConfigService to access environment variables.
    }),
  ],
  providers: [AuthService, JwtStrategy], // Provides AuthService and JwtStrategy for dependency injection.
  controllers: [AuthController], // Defines AuthController to handle authentication-related HTTP requests.
})
export class AuthModule {}
