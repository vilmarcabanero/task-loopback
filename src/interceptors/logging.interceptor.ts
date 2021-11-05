import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/context';
import {RestBindings} from '@loopback/rest';

import {bold} from 'chalk';

const configJson = require('../../config.json');

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('logs', {tags: {name: 'logging'}})
export class LoggingInterceptor implements Provider<Interceptor> {
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
    const hrstart = process.hrtime();
    try {
      const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });

      /**
       * Exclude the explorer path and when tests are run
       */
      if (
        configJson.useDetailedLogging &&
        httpReq &&
        !/^\/explorer.*/.test(httpReq.path) &&
        !/^\/actuator.*/.test(httpReq.path)
      ) {
        console.info(`Endpoint (Method): ${httpReq.path} (${httpReq.method})`);
        console.info(`Query: ${JSON.stringify(httpReq.query)}`);
        console.info(`Params: ${JSON.stringify(httpReq.params)}`);
        console.info(`Body: ${JSON.stringify(httpReq.body)}`);
        console.info(`Headers: ${JSON.stringify(httpReq.headers)}`);
        console.info(`IPs: ${httpReq.ip}`);
      }

      const result = await next();

      const httpResp = await invocationCtx.get(RestBindings.Http.RESPONSE, {
        optional: true,
      });

      /**
       * Exclude the explorer path and when tests are run
       */
      if (
        configJson.useDetailedLogging &&
        httpResp &&
        httpReq &&
        !/^\/explorer.*/.test(httpReq.path)
      ) {
        console.info(`Status Code: ${httpResp.statusCode}`);
        const hrend = process.hrtime(hrstart);
        console.info(
          bold.green('Execution time: %ds %dms\n'),
          hrend[0],
          hrend[1] / 1000000,
        );
      }

      return result;
    } catch (err) {
      const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });

      /**
       * Exclude the explorer path and when tests are run
       */
      if (err && httpReq && !/^\/explorer.*/.test(httpReq.path)) {
        console.info(`Status Code: ${err.statusCode} ${JSON.stringify(err)}`);

        const hrend = process.hrtime(hrstart);

        if (configJson.useDetailedLogging) {
          console.info(
            'Execution time: %ds %dms\n',
            hrend[0],
            hrend[1] / 1000000,
          );
        }
      }

      throw err;
    }
  }
}
