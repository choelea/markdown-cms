module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'markdown-cms',
      script    : 'server.js',
      instances: 0,
      // env: {  If we don't comment here, it will override below deploy config
      //   PORT: 3011
      // },
      env_production : {
        NODE_ENV: 'production',
        PORT:7999
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   *
   * Step1 (initiate, one time step): pm2 deploy ecosystem.config.js  production setup
   * Step2:  pm2 deploy ecosystem.config.js  production
   */
  deploy : {
    production : {
      user : 'joe',
      host : '182.254.242.31',
      ref  : 'origin/master',
      repo : 'git@github.com:choelea/markdown-cms.git',
      path : '/home/joe/nodejsapp/markdown-cms',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    prd : { // quick deploy with out npm install
      user : 'joe',
      host : '182.254.242.31',
      ref  : 'origin/master',
      repo : 'git@github.com:choelea/markdown-cms.git',
      path : '/home/joe/nodejsapp/markdown-cms',
      'post-deploy' : 'pm2 reload ecosystem.config.js --env production'
    }
  }
};
