/* eslint-disable @typescript-eslint/camelcase */
import {Provider} from '@loopback/context';
import {ServiceTokenRepository} from '../repositories';
import {repository} from '@loopback/repository';
const rp = require('request-promise');

const {SERVICETOKEN} = require('../../config');

export class ServiceTokenProvider implements Provider<string> {
  constructor(
    @repository(ServiceTokenRepository)
    public serviceTokenRepository: ServiceTokenRepository,
  ) {}

  async value() {
    let credentials;

    /**
     * There should only be at most 1 record in the datasource
     */
    credentials = await this.serviceTokenRepository.findOne();

    /**
     * Verify if the credentials have expired
     */
    if (
      credentials?.expires_in &&
      Math.round(new Date().getTime() / 1000) < credentials.expires_in &&
      credentials.access_token
    ) {
      return credentials.access_token;
    }

    const kcOptions = {
      method: 'POST',
      uri: `${SERVICETOKEN.baseUrl}/realms/${SERVICETOKEN.realm}/protocol/openid-connect/token`,
      form: {
        client_id: SERVICETOKEN.clientId,
        client_secret: SERVICETOKEN.clientSecret,
        grant_type: 'client_credentials',
      },
      json: true,
    };

    const response = await rp(kcOptions);
    credentials = {
      access_token: response.access_token,
      expires_in:
        Math.round(new Date().getTime() / 1000) + response.expires_in - 60, // set expiration 60 seconds before token expiration
      refresh_token: response.access_token,
      refresh_expires_in:
        Math.round(new Date().getTime() / 1000) +
        response.refresh_expires_in -
        60, // set expiration 60 seconds before token expiration
      token_type: response.token_type,
      id_token: response.id_token,
      session_state: response.session_state,
    };

    /**
     * Makes sure that there is only 1 record in the repository
     */
    await this.serviceTokenRepository.deleteAll();
    await this.serviceTokenRepository.create(credentials);

    return credentials.access_token;
  }
}
/* eslint-enable @typescript-eslint/camelcase */
