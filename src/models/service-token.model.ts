import {model, property, Entity} from '@loopback/repository';

@model()
export class ServiceToken extends Entity {
  @property({
    id: true,
    type: 'string',
  })
  session_state?: string;

  @property({
    type: 'string',
  })
  access_token?: string;

  @property({
    type: 'number',
  })
  expires_in?: number;

  @property({
    type: 'string',
  })
  refresh_token?: string;

  @property({
    type: 'number',
  })
  refresh_expires_in?: number;

  @property({
    type: 'string',
  })
  token_type?: string;

  @property({
    type: 'string',
  })
  id_token?: string;

  constructor(data?: Partial<ServiceToken>) {
    super(data);
  }
}

export interface ServiceTokenRelations {
  // describe navigational properties here
}

export type ServiceTokenWithRelations = ServiceToken & ServiceTokenRelations;
