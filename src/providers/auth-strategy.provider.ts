import {Provider, inject, ValueOrPromise} from '@loopback/context';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';

const KeycloakStrategy = require('../strategies/keycloak.strategy');
const {KEYCLOAK: keycloakConfig} = require('../../config');

export class AuthStrategyProvider
  implements Provider<AuthenticationStrategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
  ) {}

  value(): ValueOrPromise<AuthenticationStrategy | undefined> {
    /**
     * The function was not decorated, so we shouldn't attempt authentication
     */
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name.toLowerCase() === 'keycloak') {
      /**
       * Check if there are Keycloak Environment variables to be used as an additional config
       */
      if (
        Object.prototype.hasOwnProperty.call(process.env, 'KEYCLOAK_HOST') &&
        Object.prototype.hasOwnProperty.call(process.env, 'KEYCLOAK_REALM') &&
        Object.prototype.hasOwnProperty.call(
          process.env,
          'KEYCLOAK_CLIENT_ID',
        ) &&
        Object.prototype.hasOwnProperty.call(
          process.env,
          'KEYCLOAK_CLIENT_SECRET',
        )
      ) {
        keycloakConfig.push({
          host: process.env.KEYCLOAK_HOST,
          realm: process.env.KEYCLOAK_REALM,
          clientID: process.env.KEYCLOAK_CLIENT_ID,
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
        });
      }

      return new KeycloakStrategy(keycloakConfig, this.verify);
    } else if (name.toLowerCase() === 'disabled') {
      /* eslint-disable-next-line no-throw-literal */
      throw {
        statusCode: 404,
        message: 'This endpoint has been disabled/deprecated.',
        name: 'Disabled',
      };
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  verify(
    accessToken: string,
    refreshToken: string,
    // tslint:disable-next-line: no-any
    profile: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    // tslint:disable-next-line: no-any
    done: (err: Error | null, user?: UserProfile | false) => void,
  ) {
    // find user by name & password
    // call cb(null, false) when user not found
    // call cb(null, user) when user is authenticated
  }
}
