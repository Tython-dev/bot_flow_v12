module.exports = {
  apps: [
    {
      name: 'botpress',
      cwd: '/opt/botpress',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
