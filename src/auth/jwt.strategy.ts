import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { env } from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // Extract the JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Do not ignore the expiration date of the token
      ignoreExpiration: false,
      // Secret or key used to verify the JWT
      secretOrKey: env.JWT_SECRET,
    });
  }

  /**
   * Validates the JWT payload.
   *
   * @param payload - The payload extracted from the JWT.
   * @returns The user associated with the email in the payload.
   * @throws UnauthorizedException if the user is not found.
   */
  async validate(payload: any) {
    // Find the user by email from the payload
    const user = await this.usersService.findByEmail(payload.email);
    // If the user is not found, throw an unauthorized exception
    if (!user) {
      throw new UnauthorizedException();
    }
    // Return the user if found
    return user;
  }
}
