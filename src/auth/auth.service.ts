import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDTO } from '../dtos/user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from '../dtos/login.dto';

/**
 * The AuthService handles user authentication operations such as registration,
 * login, and generating JWT tokens for authenticated users.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates the user credentials.
   * Compares the provided password with the hashed password stored in the database.
   *
   * @param email - The email of the user.
   * @param pass - The password provided by the user.
   * @returns The user object without the password if validation is successful, otherwise null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && (await bcrypt.compare(pass, user.password))) {
        // Remove the password field from the user object before returning
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user.toObject();
        return result;
      }
      return null;
    } catch (error) {
      this.logger.error('Error validating user', error);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Generates a JWT token for the authenticated user.
   *
   * @param loginDTO - The login data transfer object.
   * @returns An object containing the JWT token.
   */
  async login(loginDTO: LoginDTO) {
    try {
      const user = await this.validateUser(loginDTO.email, loginDTO.password);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      const payload = { email: user.email, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error('Error logging in user', error);
      throw new HttpException(
        'Failed to login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Registers a new user by hashing their password and storing their details in the database.
   *
   * @param userDTO - The data transfer object containing user registration details.
   * @returns A JWT token for the newly registered user.
   */
  async register(userDTO: UserDTO) {
    try {
      // Check if a user with the given email already exists
      const existingUser = await this.usersService.findByEmail(userDTO.email);
      if (existingUser) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await bcrypt.hash(userDTO.password, 10);
      const createdUser = await this.usersService.create({
        ...userDTO,
        password: hashedPassword,
      });
      return this.login({
        email: createdUser.email,
        password: userDTO.password,
      });
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.BAD_REQUEST
      ) {
        this.logger.error(`Duplicate key error: ${error.message}`, error);
        throw error;
      }
      this.logger.error('Error registering user', error);
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
