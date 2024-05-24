import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for user registration.
 * It defines the structure of the data required for user registration and includes validation rules.
 */
export class UserDTO {
  /**
   * The name of the user.
   * It must be a non-empty string.
   */
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

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

/**
 * Partial DTO for updating user details.
 * Extends the UserDTO and marks all fields as optional.
 * This allows updating only the provided fields while maintaining required field constraints.
 */
export interface PartialUserDTO extends Partial<UserDTO> {}
