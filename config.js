module.exports = {
  hooks : {
    'dams-v2-sandbox-webhook' : {
      filters : [
      // {
      //   '$event' : 'pull_request',
      //   action : 'closed',
      //   pull_request : {
      //     merged : true,
      //     base : {
      //       ref : 'v2.0-sandbox'
      //     }
      //   }
      // },
      {
        '$event' : 'push',
        commits : '$exists',
        ref : 'refs/heads/v2.0-sandbox',
      }],
      repositories : [
        'UCDavisLibrary/fin-ucd-lib-server',
        'UCDavisLibrary/fin-server'
      ]
    },

    'rp-sandbox-webhook' : {
      filters : [
      // {
      //   '$event' : 'pull_request',
      //   action : 'closed',
      //   pull_request : {
      //     merged : true,
      //     base : {
      //       ref : 'sandbox'
      //     }
      //   }
      // },
      {
        '$event' : 'push',
        ref : 'refs/heads/sandbox',
      }],
      repositories : [
        'ucd-library/rp-ucd-client',
        'ucd-library/vessel'
      ]
    }
  },

  projectName : process.env.PROJECT_NAME || 'digital-ucdavis-edu',
  apiKey : process.env.API_KEY || '',
  gcbSecret : process.env.GCB_SECRET || '',
  githubSecret : process.env.GITHUB_SECRET || '',

  // you can either directly store secrets as env variables OR, preferably
  // you store secrets in the Google Cloud Secret Manager, providing the 
  // secret name as the env variables specified below
  secretNameEnvVars : {
    apiKeySecretName : process.env.API_KEY_SECRET_NAME || 'github-webook-api-key',
    gcbSecretSecretName : process.env.GCB_SECRET_SECRET_NAME || 'github-webhook-gcb-secret', 
    githubSecretSecretName : process.env.GITHUB_SECRET_SECRET_NAME || 'github-webhook-github-secret'
  },

  server : {
    port : process.env.PORT || process.env.SERVER_PORT || 3000
  }
}