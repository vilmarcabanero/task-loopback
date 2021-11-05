import {HandlerContext} from '@loopback/rest';
import {Provider, inject} from '@loopback/context';
import {RestBindings, Request} from '@loopback/rest';

import CustomError, {CustomReject} from '../interfaces/customError.interface';

export class CustomErrorProvider implements Provider<CustomReject> {
  constructor(@inject(RestBindings.Http.REQUEST) public request: Request) {}

  value() {
    /**
     * Use the lambda syntax to preserve the "this" scope for future calls
     */
    return (handlerContext: HandlerContext, err: CustomError) => {
      this.action(handlerContext, err);
    };
  }

  /**
   * Use the mimeType given in the request's Accept header to convert
   * the response object!
   * @param response The response object used to reply to the  client.
   * @param result The result of the operation carried out by the controller's
   * handling function.
   */
  action(handlerContext: HandlerContext, err: CustomError) {
    const response = handlerContext.response;
    /**
     * Currently, the headers interface doesn't allow arbitrary string keys
     */
    const header = 'application/json';
    response.setHeader('Content-Type', header);
    response.statusCode = err.code;
    response.end(JSON.stringify(err));
  }
}
