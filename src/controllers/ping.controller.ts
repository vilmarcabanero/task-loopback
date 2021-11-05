import {
  Request,
  RestBindings,
  get,
  ResponseObject,
  post,
  oas,
} from '@loopback/rest';
import {inject} from '@loopback/context';
import {authenticate} from '@loopback/authentication';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject('servicetoken.actions.retrieve') private serviceToken,
  ) {}

  /**
   * Map to `GET /ping` using the @get decorator
   */
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  @oas.tags('builtin')
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'pong',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  /**
   * Map to `GET /check-st` using the @get decorator
   * Checks if the Service Token Provider is ok
   */
  @get('/check-st', {
    responses: {
      '200': {
        description: 'Service Token Provider status',
        content: {'text/plain': {schema: {type: String}}},
      },
    },
  })
  @oas.tags('builtin')
  checkServicetoken(): string {
    return this.serviceToken;
  }

  /**
   * Map to `GET /test-error` using the @post decorator
   */
  @post('/test-error', {
    responses: {
      '500': {
        description: 'Test Error display',
        content: {'text/plain': {schema: {type: String}}},
      },
    },
  })
  @oas.deprecated(true)
  @oas.tags('builtin')
  testError(): object {
    // eslint-disable-next-line no-throw-literal
    throw {
      code: 500,
      message: 'test error display',
      name: 'SERVICE_UNAVAILABLE',
    };
  }
}
