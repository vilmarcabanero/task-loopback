module.exports = {
  apps: [
    {
      name: 'loopback-starter', // rename to project name
      script: 'index.js',
      // error_file: '', // out error file
      // out_file: '', // out log file
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      source_map_support: true,
      time: true,
      env: {
        NODE_ENV: 'local',
        // HOST: '',
      },
      env_dit: {
        NODE_ENV: 'dit',
        // HOST: ''
      },
      env_sit: {
        NODE_ENV: 'sit',
        // HOST: ''
      },
      env_uat: {
        NODE_ENV: 'uat',
        // HOST: ''
      },
      env_prod: {
        NODE_ENV: 'prod',
        // HOST: ''
      },
      env_brc: {
        NODE_ENV: 'brc',
        // HOST: ''
      },
    },
  ],
};
