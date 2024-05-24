import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../dtos/user.dto';
import { LoginDTO } from '../dtos/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * AuthController handles user authentication-related requests such as registration and login.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   *
   * @param userDTO - The user data transfer object containing registration details.
   * @returns A JWT token for the newly registered user.
   */
  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: UserDTO,
    description: 'The registration data',
    examples: {
      example1: {
        summary: 'Valid registration',
        value: {
          email: 'newuser@example.com',
          password: 'strongPassword123',
          name: 'New User',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() userDTO: UserDTO) {
    return this.authService.register(userDTO);
  }

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param loginDTO - The login data transfer object containing email and password.
   * @returns A JWT token for the authenticated user.
   */
  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({
    type: LoginDTO,
    description: 'The login data',
    examples: {
      example1: {
        summary: 'Valid login',
        value: {
          email: 'user@example.com',
          password: 'strongPassword123',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }
}
