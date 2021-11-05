// tslint:disable: no-invalid-this
// tslint:disable: no-any
// eslint-disable @typescript-eslint/no-explicit-any
const util = require('util');
const Strategy = require('passport-strategy');
import parseBearerToken from 'parse-bearer-token';
const request = require('request-promise');
const jwtDecode = require('jwt-decode');
import {Request} from '@loopback/rest';
import {bold} from 'chalk';

// tslint:disable-next-line: no-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function KeycloakStrategy(this: any, options: any, verify: any) {
  options.forEach((kcc) => {
    ['host', 'realm', 'clientId', 'clientSecret'].forEach((k) => {
      if (!kcc[k]) {
        throw new Error(`${k} is required`);
      }
    });
  });

  this.options = options;
  this._base = Object.getPrototypeOf(KeycloakStrategy.prototype);
  this._base.constructor.call(this, this.options, verify);
  this.name = 'Keycloak';
}

util.inherits(KeycloakStrategy, Strategy);

KeycloakStrategy.prototype.authenticate = async function (
  req: Request,
  options?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const token = parseBearerToken(req);
  if (!token) {
    // eslint-disable-next-line no-throw-literal
    throw {
      code: 401,
      message: 'Request unauthorized',
      name: 'Unauthorized',
    };
  }
  const jwt = jwtDecode(token);

  const opts = this.options.filter(
    (opt) =>
      jwt.iss === `${opt.host}/realms/${opt.realm}` && jwt.aud === opt.clientId,
  );

  if (opts.length > 0) {
    // use the first match
    const response = await request({
      method: 'POST',
      uri: `${opts[0].host}/realms/${opts[0].realm}/protocol/openid-connect/token/introspect`,
      form: {
        client_id: opts[0].clientId, // eslint-disable-line
        client_secret: opts[0].clientSecret, // eslint-disable-line
        token,
      },
      json: true,
    });

    if (!response.active) {
      // eslint-disable-next-line no-throw-literal
      throw {
        code: 401,
        message: 'Request unauthorized',
        name: 'Unauthorized',
      };
    }

    return response;
  } else {
    console.error(bold.red('No matching config found for introspection.'));
    // eslint-disable-next-line no-throw-literal
    throw {
      code: 401,
      message: 'Request unauthorized',
      name: 'Unauthorized',
    };
  }
};

KeycloakStrategy.prototype.userProfile = async function (
  accessToken: string,
  done: (err?: Error | null, profile?: any) => void, // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<void> {
  const jwt = jwtDecode(accessToken);
  const opts = this.options.filter(
    (opt) =>
      jwt.iss === `${opt.host}/realms/${opt.realm}` && jwt.aud === opt.clientID,
  );

  if (opts.length > 0) {
    const kcOptions = {
      method: 'POST',
      uri: `${opts[0].host}/realms/${opts[0].realm}/protocol/openid-connect/userinfo`,
      form: {
        client_id: opts[0].clientID, // eslint-disable-line
        client_secret: opts[0].clientSecret, // eslint-disable-line
        access_token: accessToken, // eslint-disable-line @typescript-eslint/camelcase
      },
      json: true,
    };

    const response = await request(kcOptions);
    done(null, response);
  } else {
    console.error(
      bold.red('No matching config found for introspection.'),
      accessToken,
    );
    // eslint-disable-next-line no-throw-literal
    throw {
      code: 401,
      message: 'Request unauthorized',
      name: 'Unauthorized',
    };
  }
};

module.exports = KeycloakStrategy;
