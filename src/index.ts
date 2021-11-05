import {Lb4StarterApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {bold} from 'chalk';

export {Lb4StarterApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new Lb4StarterApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(bold.green(`Server is running at ${url}`));
  console.log(bold.blue(`Try ${url}/ping\n`));

  return app;
}
