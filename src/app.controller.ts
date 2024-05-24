import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('default')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  /**
   * Get the application status.
   * @returns A string indicating the application status.
   * @throws HttpException if there is an error while retrieving the status.
   */
  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  getStatus(): string {
    try {
      // Calling the AppService to get the application status.
      return this.appService.getStatus();
    } catch (error) {
      // Logging the error and throwing an HttpException if an error occurs.
      this.logger.error('Error getting application status', error);
      throw new HttpException(
        'Failed to get application status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
