import { Injectable, Logger } from '@nestjs/common';

/**
 * AppService is a service that provides business logic for the application.
 * This service contains methods that can be used by controllers and other services.
 */
@Injectable()
export class AppService {
  // Logger instance to log messages for this service
  private readonly logger = new Logger(AppService.name);

  /**
   * Method to get the status of the application.
   * This can be used to check if the backend is running and operational.
   *
   * @returns {string} - A status message indicating the backend is working.
   */
  getStatus(): string {
    try {
      // Return a status message
      return 'E-commerce backend is working';
    } catch (error) {
      // Log an error message if something goes wrong
      this.logger.error('Error in getStatus method', error);
      // Throw a new error with a descriptive message
      throw new Error('Failed to get application status');
    }
  }
}
