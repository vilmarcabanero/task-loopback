import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import * as path from 'path';
import {MySequence} from './sequence';
import {CustomErrorProvider} from './providers/custom-error.provider';
import {
  AuthenticationComponent,
  AuthenticationBindings,
} from '@loopback/authentication';
import {AuthStrategyProvider} from './providers';
import {HealthComponent, HealthBindings} from '@loopback/extension-health';
import {
  EnvDatasourceHelper,
  hasDatasources,
} from './utils/env-datasource.utils';

import {MetricsComponent, MetricsBindings} from '@loopback/extension-metrics';

import {ServiceTokenProvider} from './providers/service-token.provider';

import {CachingService} from './services/caching';
import {CachingInterceptor} from './interceptors';
import {CACHING_SERVICE} from './keys';

export class Lb4StarterApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    /**
     * Set up environemnt configurations
     */
    const env = process.env.NODE_ENV ?? false;
    if (env !== false && hasDatasources) {
      const eds = new EnvDatasourceHelper(env);
      const dsConfigs = eds.getConfig();
      dsConfigs.forEach((config) => {
        console.log(config)
        this.bind('datasources.config.' + config.name).to(config.config);
        this.bind('datasources.' + config.name).toClass(config.datasource);
      });
    }

    this.component(AuthenticationComponent);
    this.bind(AuthenticationBindings.STRATEGY).toProvider(AuthStrategyProvider);

    /**
     * Prometheus metrics
     */
    this.component(MetricsComponent);
    this.configure(MetricsBindings.COMPONENT).to({
      endpoint: {
        basePath: '/metrics',
      },
      defaultMetrics: {
        timeout: 5000,
      },
    });

    /**
     * Add caching interceptor bindings
     */
    this.add(createBindingFromClass(CachingService, {key: CACHING_SERVICE}));
    this.add(createBindingFromClass(CachingInterceptor));

    /**
     * Set up the custom sequence
     */
    this.sequence(MySequence);
    this.bind('error.actions.custom').toProvider(CustomErrorProvider);
    this.bind('servicetoken.actions.retrieve').toProvider(ServiceTokenProvider);

    /**
     * Set up default home page
     */
    this.static('/', path.join(__dirname, '../public'));

    /**
     * Customize @loopback/rest-explorer configuration here
     */
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;

    /**
     * Customize @loopback/boot Booter Conventions here
     */
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    /**
     * Set up the healthCheck. Use values from command line if provided.
     * @todo verify if this can be replaced by the prometheus endpoints
     */
    const {
      PATH_HEALTH = '/actuator/health',
      PATH_LIVE = '/actuator/live',
      PATH_READY = '/actuator/ready',
    } = process.env;
    this.configure(HealthBindings.COMPONENT).to({
      healthPath: PATH_HEALTH,
      livePath: PATH_LIVE,
      readyPath: PATH_READY,
    });
    this.component(HealthComponent);
  }
}
