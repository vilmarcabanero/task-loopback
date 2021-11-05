import {expect} from '@loopback/testlab';
import {Lb4StarterApplication} from '../..';
import {RestServer, RestBindings} from '@loopback/rest';
import {setupApplication} from './test-helper';
const Dredd = require('dredd');

describe('API (acceptance)', () => {
  let app: Lb4StarterApplication;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // tslint:disable-next-line: no-any
  let dredd: any;

  before('setupApplication', async () => {
    ({app} = await setupApplication());
    await initEnvironment();
  });

  after(async () => {
    await app.stop();
  });

  it('conforms to the specification', (done) => {
    dredd.run((err: Error, stats: object) => {
      if (err) return done(err);
      expect(stats).to.containDeep({
        failures: 2, // test-error, test-auth
        errors: 0,
        skipped: 0,
      });
      done();
    });
  });

  async function initEnvironment() {
    const server = await app.getServer(RestServer);
    const port = await server.get(RestBindings.PORT);
    const baseUrl = `http://localhost:${port}`;
    const config: object = {
      server: baseUrl,
      options: {
        level: 'silent',
        path: [`${baseUrl}/explorer/openapi.json`],
      },
    };
    dredd = new Dredd(config);
  }
});
