import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import { HttpErrors, RestBindings } from '@loopback/rest';
const url = require('url');
const configJson = require('../../config.js');

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('security', { tags: { name: 'referercheck' } })
export class ReferercheckInterceptor implements Provider<Interceptor> {
  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      if (JSON.parse(configJson.limitReferer)) {
        const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {
          optional: true,
        });
        let parsedUrl;
        if (httpReq?.headers.referer) {
          parsedUrl = url.parse(httpReq?.headers.referer, true);
        } else {
          throw new HttpErrors.Unauthorized();
        }

        if (!configJson.allowedReferers.includes(parsedUrl.hostname)) {
          throw new HttpErrors.Unauthorized();
        }
      }
      // Add pre-invocation logic here
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
