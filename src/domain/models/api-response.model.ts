/**
 * Standard model for API responses
 * Provides a consistent format for all responses
 */
export class ApiResponse<T = any> {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly data?: T,
    public readonly code?: string,
    public readonly timestamp: string = new Date().toISOString(),
  ) {}

  /**
   * Create a successful response
   */
  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  /**
   * Create an error response
   */
  static error(message: string, code?: string, data?: any): ApiResponse {
    return new ApiResponse(false, message, data, code);
  }

  /**
   * Create an error response from an exception
   */
  static fromException(exception: any): ApiResponse {
    return new ApiResponse(
      false,
      exception.message || 'An error occurred',
      exception.details,
      exception.code,
    );
  }

  /**
   * Convert the response to a plain object
   */
  toObject(): any {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
      code: this.code,
      timestamp: this.timestamp,
    };
  }
}
