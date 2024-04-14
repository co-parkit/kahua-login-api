import { IresponseCode } from '../../config/response-code.interface';

export interface IresponseBase<T = any> extends IresponseCode {
  data?: T;
  pagination?: T;
}

export class Response<T = any> implements IresponseBase<T> {
  public code: string;
  public message: string;
  public status: number;
  save: any;

  constructor(
    responseCode: IresponseCode,
    public data?: T,
    public pagination?: T,
  ) {
    Object.assign(this, responseCode);
  }

  public getHttp() {
    return {
      statusCode: this.status ?? 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
      },
      body: JSON.stringify(this),
    };
  }
}
