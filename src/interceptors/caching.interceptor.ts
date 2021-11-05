// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeting-app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  asGlobalInterceptor,
  bind,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {RestBindings} from '@loopback/rest';
import {CachingService} from '../services/caching';
import {CACHING_SERVICE} from '../keys';
import {bold} from 'chalk';

const configJson = require('../../config.json');

@bind(asGlobalInterceptor('caching'))
export class CachingInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(CACHING_SERVICE) private cachingService: CachingService,
  ) {}

  value() {
    return async (
      ctx: InvocationContext,
      next: () => ValueOrPromise<InvocationResult>,
    ) => {
      const httpReq = await ctx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });
      /* istanbul ignore if */
      if (!httpReq || httpReq.method.toUpperCase() !== 'GET') {
        // Not http request
        return next();
      }
      const hrstart = process.hrtime();

      const key = httpReq.path;
      const cachingKey = key;

      if (configJson.useCache) {
        const cachedResult = await this.cachingService.get(cachingKey);
        if (cachedResult) {
          if (
            configJson.useDetailedLogging &&
            httpReq &&
            !/^\/explorer.*/.test(httpReq.path)
          ) {
            console.info(
              `Endpoint (Method): ${httpReq.path} (${httpReq.method})`,
            );
            console.info(`Query: ${JSON.stringify(httpReq.query)}`);
            console.info(`Params: ${JSON.stringify(httpReq.params)}`);
            console.info(`Body: ${JSON.stringify(httpReq.body)}`);
            console.info(`Status Code: CACHED`);
            const hrend = process.hrtime(hrstart);
            console.info(
              bold.green('Execution time: %ds %dms\n'),
              hrend[0],
              hrend[1] / 1000000,
            );
          }
          return cachedResult.data;
        }
      }
      const httpResp = await next();
      if (configJson.useCache) {
        await this.cachingService.set(cachingKey, {
          timestamp: new Date(),
          data: httpResp,
        });
      }
      return httpResp;
    };
  }
}
