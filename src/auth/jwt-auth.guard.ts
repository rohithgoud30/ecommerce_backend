import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Determines whether the current request should be allowed to proceed.
   *
   * @param context - The execution context, which provides details about the current request.
   * @returns A boolean indicating whether the request is allowed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the request object from the execution context
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    // Call the parent class's canActivate method to perform the default JWT validation
    const result = (await super.canActivate(context)) as boolean;

    // Return the result of the validation (true if the request is allowed, false otherwise)
    return result;
  }
}
