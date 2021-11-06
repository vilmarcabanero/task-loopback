import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {CustomReject} from './interfaces/customError.interface';
const config = require('../package.json');

import {JsonBodyParser} from '@loopback/rest/dist/body-parsers/body-parser.json';
// import {AuthenticationBindings, AuthenticateFn} from '@loopback/authentication';
import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';

const SequenceActions = RestBindings.SequenceActions;

/**
 * Method to deep remove empty or undefined keys in an object
 * @param obj
 */
// tslint:disable-next-line: no-any
const removeEmpty = (obj: Object) => {
  const o = JSON.parse(JSON.stringify(obj)); // Clone source oect.

  Object.keys(o).forEach((key) => {
    if (o[key] && typeof o[key] === 'object') o[key] = removeEmpty(o[key]);
    // Recurse.
    else if (o[key] === undefined || o[key] === null) delete o[key];
  });

  return o; // Return new object.
};

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    // @inject(AuthenticationBindings.AUTH_ACTION)
    // protected authenticateRequest: AuthenticateFn,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject('error.actions.custom')
    protected reject: CustomReject,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);

      // await this.authenticateRequest(request);
      await this.authenticateRequest(request);
      /**
       * Cleanup of null data
       */
      const parser = new JsonBodyParser();
      const body = await parser.parse(request);
      if (body.value !== undefined) {
        request.body = removeEmpty(body.value);
      }

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      if (
        route.path.indexOf('openapi.json') !== -1 ||
        process.env.npm_lifecycle_event === 'test'
      ) {
        /**
         * specific exception not to format openapi specification
         */
        this.send(response, result);
      } else {
        const formattedResult = {
          programName: config.name,
          version: config.version,
          datetime: new Date().toISOString(),
          status:
            request.statusCode === null || request.statusCode === 200
              ? 'success'
              : 'error',
          code: request.statusCode ?? 200,
          message: request.statusMessage,
          data: result,
        };
        this.send(response, formattedResult);
      }
    } catch (err) {
      // make the statusCode 401
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      }

      if (process.env.npm_lifecycle_event === 'test') {
        this.reject(context, err);
      } else {
        err.message = `${err.message} ${
          Object.prototype.hasOwnProperty.call(err, 'details')
            ? JSON.stringify(err.details)
            : ''
        }`;
        const error = {
          programName: config.name,
          version: config.version,
          datetime: new Date().toISOString(),
          status: 'error',
          code: +err.statusCode || 500,
          message: err.message.trim(),
          data: {
            errors: [
              {
                code: err.name,
                message: err.message.trim(),
              },
            ],
          },
        };
        this.reject(context, error);
      }
    }

    context.close();
  }
}
