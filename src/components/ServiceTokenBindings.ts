import {Component, BindingKey, ProviderMap} from '@loopback/core';
import {ServiceTokenProvider} from '../providers/service-token.provider';
import {ServiceToken} from '../models/service-token.model';

export namespace ServiceTokenBindings {
  export const RETRIEVE = BindingKey.create<ServiceToken>(
    'servicetoken.actions.retrieve',
  );
}

export class ServiceTokenComponent implements Component {
  providers?: ProviderMap;

  constructor() {
    this.providers = {
      [ServiceTokenBindings.RETRIEVE.key]: ServiceTokenProvider,
    };
  }
}
