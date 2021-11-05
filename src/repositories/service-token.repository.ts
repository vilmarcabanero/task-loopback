/* eslint-disable @typescript-eslint/camelcase */
import {DefaultCrudRepository} from '@loopback/repository';
import {ServiceToken, ServiceTokenRelations} from '../models';
import {ServiceTokenStorageDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ServiceTokenRepository extends DefaultCrudRepository<
  ServiceToken,
  typeof ServiceToken.prototype.session_state,
  ServiceTokenRelations
> {
  constructor(
    @inject('datasources.ServiceTokenStorage')
    dataSource: ServiceTokenStorageDataSource,
  ) {
    super(ServiceToken, dataSource);
  }
}
/* eslint-enable @typescript-eslint/camelcase */
