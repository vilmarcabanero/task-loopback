import fs = require('fs');
import * as datasources from '../datasources';
import {Constructor} from '@loopback/core';

/**
 * This helper function will automatically select which datasource will be used depending on the environment set in process.env.NODE_ENV
 * process.env.NODE_ENV = prod | uat | sit | dev | local
 *
 * It will read files from datasources folder
 * File format = ${db}.datasource.${NODE_ENV}.json
 */

const dir = String('/src/datasources/');

export const hasDatasources = fs.existsSync('.' + dir);

export class EnvDatasourceHelper {
  env: String;

  constructor(environment: String) {
    this.env = environment;
  }

  getConfig() {
    // Set datasource based on environment
    const dsC: Array<{
      name: string;
      config: object;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      datasource: Constructor<any>;
    }> = [];

    const files = fs.readdirSync(`.${dir}`);
    files.forEach((file) => {
      if (file.indexOf(`.${this.env}.json`) > -1) {
        const config = require(`../..${dir}${file}`);
        const dsClass =
          file.split('.')[0].charAt(0).toUpperCase() +
          file.split('.')[0].substring(1) +
          'DataSource';
        dsC.push({
          name: file.split('.')[0],
          config: config,
          datasource: datasources[dsClass],
        });
      }
    });
    return dsC;
  }
}
