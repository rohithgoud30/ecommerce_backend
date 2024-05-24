import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for user login.
 * It defines the structure of the data required for user login and includes validation rules.
 */
export class LoginDTO {
  /**
   * The email of the user.
   * It must be a valid email address.
   */
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;

  /**
   * The password of the user.
   * It must be at least 6 characters long.
   */
  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
