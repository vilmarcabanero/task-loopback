import {ServiceTokenRepository} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';

export async function givenEmptyDatabase() {
  await new ServiceTokenRepository(testdb).deleteAll();
}
