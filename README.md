# loopback-starter

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

# Getting a local copy

```
git clone --depth 1 -b develop https://172.23.199.70/itg/mbo/loopback-starter.git [yourdirectory]
cd [yourdirectory]
rm -fr .git
```

# Starting your new service

After getting your local copy and adding your new code into a repository, edit the package.json immediately to change the **name**, **version** and **description** of the new service.

On your first commit comment the following lines in the .gitignore file but do not include the .gitignore in the commit:

```
.env

public/
```

Afterwards, uncomment the 2 lines and proceed with normal development.

When adding a new datasource, you will need to modify the generated files to comply with the env based configurations. Below is a guide (which may not be exactly the same) 

.env

```
DATASOURCES_MONGODB={"name":"mongodb","connector":"mongodb","url":"mongodb://mongouser:mongopassword@127.0.0.1:27017/sample"}
```

mongodb.datasource.ts

```
require('dotenv').config();
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongodb';
  static readonly defaultConfig = process.env.DATASOURCES_MONGODB;

  constructor(
    @inject('datasources.config.mongodb', {optional: true})
    dsConfig: object = JSON.parse(process.env.DATASOURCES_MONGODB + ''),
  ) {
    super(dsConfig);
  }
}
```

# Running Loopback/cli commands

```
npm run lb4:[command]
```

#### Available commands
* app
* extension
* controller
* datasource
* model
* repository
* service
* example
* openapi
* observer
* interceptor
* discover
* relation

For details on each command, please go [here](https://loopback.io/doc/en/lb4/Command-line-interface.html).

# Customizations made

## Customized HTTP Response JSON format

## Keycloak authentication (via introspection)

## Health actuator

## Environment based configuration

Configuration data is now stored in .env files for externalization in each environment.

When there is a change in a configuration variable, a rebuild is no longer needed. Just restart the process with the `--update-env` parameter.

Example:

`pm2 restart loopback-starter --update-env`

