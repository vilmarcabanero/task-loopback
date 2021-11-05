import {HandlerContext} from '@loopback/rest';

export default interface CustomError {
  programName: string;
  version: string;
  datetime: string;
  status: string;
  code: number;
  message: string;
  data: string | object;
}

export declare type CustomReject = (
  handlerContext: HandlerContext,
  err: CustomError,
) => void;
