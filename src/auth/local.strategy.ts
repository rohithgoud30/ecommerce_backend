import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs a new instance of the LocalStrategy.
   *
   * @param authService - The AuthService instance used to validate user credentials.
   */
  constructor(private readonly authService: AuthService) {
    // Call the base class constructor with custom options
    super({ usernameField: 'email' });
  }

  /**
   * Validates the user credentials.
   *
   * @param email - The email address of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves to the authenticated user or throws an UnauthorizedException if validation fails.
   */
  async validate(email: string, password: string): Promise<any> {
    // Validate the user's credentials using the AuthService
    const user = await this.authService.validateUser(email, password);

    // If user is not found or credentials are invalid, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException();
    }

    // Return the authenticated user
    return user;
  }
}
