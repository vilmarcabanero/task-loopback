import {ServiceTokenStorageDataSource} from '../../../datasources';

export const testdb: ServiceTokenStorageDataSource = new ServiceTokenStorageDataSource(
  {
    name: 'db',
    connector: 'memory',
  },
);
