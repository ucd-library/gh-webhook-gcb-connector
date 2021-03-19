module.exports = {
  hooks : {
    'dams-v2-webhook' : {
      fitler : [{
        action : 'closed',
        pull_request : {
          merged : true
        }
      }],
      repositories : [
        'ucd-library/gh-webhook-example'
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
    apiKeySecretName : process.env.API_KEY_SECRET_NAME || '',
    gcbSecretSecretName : process.env.GCB_SECRET_SECRET_NAME || '', 
    githubSecretSecretName : process.env.GITHUB_SECRET_SECRET_NAME || '', 
  },

  server : {
    port : process.env.PORT || process.env.SERVER_PORT || 3000
  }
}