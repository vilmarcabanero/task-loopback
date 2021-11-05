import {Client, expect} from '@loopback/testlab';
import {Lb4StarterApplication} from '../..';
import {setupApplication} from './test-helper';
import {ServiceTokenProvider} from '../../providers/';
import {ServiceTokenRepository} from '../../repositories';
import {ServiceTokenStorageDataSource} from '../../datasources';
import dsConfig from '../../datasources/service-token-storage.datasource.config.json';

describe('PingController', () => {
  let app: Lb4StarterApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'pong'});
  });

  it('invokes GET /check-st', async () => {
    const res = await client.get('/check-st').expect(200);
    expect(typeof res.text).to.equal('string');
  });

  it('invokes GET /test-error', async () => {
    await client.post('/test-error').send({key: 'value'}).expect(500);
  });

  it('invokes GET /test-auth without a token', async () => {
    await client.get('/test-auth').expect(401);
  });

  it('invokes GET /test-auth with a token', async () => {
    const stsds = new ServiceTokenStorageDataSource(dsConfig);
    const str = new ServiceTokenRepository(stsds);
    const stp = new ServiceTokenProvider(str);
    const token = await stp.value();
    const res = await client
      .get('/test-auth')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.text).to.equal('Success');
  });
});
