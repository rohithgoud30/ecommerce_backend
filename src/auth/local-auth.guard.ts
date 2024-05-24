import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /**
   * Determines whether the current request is allowed to proceed.
   *
   * @param context - The execution context for the current request.
   * @returns A promise that resolves to a boolean indicating whether the request is allowed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call the canActivate method of the base AuthGuard class
    const result = (await super.canActivate(context)) as boolean;

    // Get the current request object
    const request = context.switchToHttp().getRequest();

    // Log in the user using the Passport.js logIn method
    await super.logIn(request);

    // Return the result of the base canActivate method
    return result;
  }
}
