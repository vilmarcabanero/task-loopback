import {
  inject,
  lifeCycleObserver, // The decorator
  LifeCycleObserver, // The interface
} from '@loopback/core';
import {CachingService} from '../services/caching';
import {CACHING_SERVICE} from '../keys';

const configJson = require('../../config.json');

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('caching')
export class CacheObserver implements LifeCycleObserver {
  private timer: NodeJS.Timer;
  constructor(
    @inject(CACHING_SERVICE) private cachingService: CachingService,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    if (configJson.useCache) {
      await this.cachingService.start();
    }
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    if (configJson.useCache) {
      await this.cachingService.stop();
    }
  }
}
