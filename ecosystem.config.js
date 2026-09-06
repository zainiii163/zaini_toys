module.exports = {
  apps: [
    {
      name: 'toy-api',
      script: 'apps/api/dist/server.js',
      cwd: '.',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
    },
  ],
};
