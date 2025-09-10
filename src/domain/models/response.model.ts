import { IResponseCode } from '../interfaces/response.interface';

export class Response {
  constructor(
    public code: string | IResponseCode,
    public data?: any,
    public message?: string,
    public status?: number,
  ) {
    if (typeof code === 'object') {
      this.code = code.code;
      this.message = code.message;
      this.status = code.status;
    }
  }

  static success(data: any, code = 'SUCCESS'): Response {
    return new Response(code, data);
  }

  static error(code: string, message?: string, status?: number): Response {
    return new Response(code, null, message, status);
  }

  toJSON() {
    return {
      code: this.code,
      data: this.data,
      message: this.message,
      status: this.status,
    };
  }
}
