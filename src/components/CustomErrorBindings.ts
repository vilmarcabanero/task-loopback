import {Component, BindingKey, ProviderMap} from '@loopback/core';
import {CustomErrorProvider} from '../providers/custom-error.provider';
import CustomError from '../interfaces/customError.interface';

export namespace CustomErrorBindings {
  export const CUSTOM_ERROR = BindingKey.create<CustomError>(
    'error.actions.custom',
  );
}

export class CustomErrorComponent implements Component {
  providers?: ProviderMap;

  constructor() {
    this.providers = {
      [CustomErrorBindings.CUSTOM_ERROR.key]: CustomErrorProvider,
    };
  }
}
